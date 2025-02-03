import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Required for file upload
  },
};

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("tredence");
    const openai = new OpenAI();

    // **Fix: Define and Ensure Upload Directory Exists**
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // **Fix: Use Formidable with the Correct Upload Directory**
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    // **Parse Form Data & Handle File Upload**
    const [fields, files] = await form.parse(req);
    const file = files.featureFile?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // **Ensure File Exists Before Reading**
    const filePath = file.filepath; // Path where Formidable saved the file
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "File was not saved correctly" });
    }

    const fileName = file.originalFilename;
    const jiraId = fields.jiraId?.[0] || fileName.replace(".feature", ""); // Extract Jira ID from filename

    console.log("jiraId===", jiraId, "Fields===", fields)

    // **Read Uploaded File Content**
    const bddTestCases = fs.readFileSync(filePath, "utf8");

    // **Generate Step Definitions using OpenAI**
    const stepDefCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate JavaScript step definitions for the given BDD test cases. The functions should be reusable and structured for automated testing.",
        },
        {
          role: "user",
          content: `Generate step definitions for the following BDD test cases:
          ---
          ${bddTestCases}
          ---
          `,
        },
      ],
    });

    let stepDefinitions = stepDefCompletion.choices[0].message.content;

    // **Check for Existing Test Case and Apply Version Control**
    const existingTestCase = await db.collection("testcases").findOne({ jiraId });
    let version = 1;
    if (existingTestCase) {
      version = existingTestCase.version + 1;
      await db.collection("testcases").updateOne(
        { jiraId },
        {
          $set: { bddTestCases, stepDefinitions, version, updated: new Date() },
          $push: {
            previousVersions: {
              version: existingTestCase.version,
              bddTestCases: existingTestCase.bddTestCases,
              stepDefinitions: existingTestCase.stepDefinitions,
              updated: existingTestCase.updated || existingTestCase.created,
            },
          },
        }
      );
    } else {
      await db.collection("testcases").insertOne({
        bddTestCases,
        stepDefinitions,
        jiraId,
        userId: user.sub,
        version,
        previousVersions: [],
        created: new Date(),
      });
    }

    // **Save to Local Directory**
    const testCaseFileName = `testcase_${jiraId}_v${version}.feature`;
    const stepDefFileName = `step_definitions_${jiraId}_v${version}.js`;
    const testCaseFilePath = path.join(process.cwd(), "public", "testcases", testCaseFileName);
    const stepDefFilePath = path.join(process.cwd(), "public", "testcases", stepDefFileName);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(testCaseFilePath), { recursive: true });

    // Write files
    fs.writeFileSync(testCaseFilePath, bddTestCases, "utf8");
    fs.writeFileSync(stepDefFilePath, stepDefinitions, "utf8");

    console.log("BDD Test Case & Step Definitions saved:", { jiraId, version });

    res.status(200).json({
      message: "BDD Test case and step definitions saved successfully",
      jiraId,
      version,
      files: {
        testCase: `/testcases/${testCaseFileName}`,
        stepDefinitions: `/testcases/${stepDefFileName}`,
      },
    });
  } catch (error) {
    console.error("Error processing BDD test case:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
