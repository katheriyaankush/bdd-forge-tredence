import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { topic, jiraId } = req.body;
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("tredence");

    // Fetch the project data for the user
    const project = await db.collection("projects").findOne({ userId: user.sub });
    if (!project) {
      return res.status(404).json({ error: "Project not found for the user" });
    }

    const openai = new OpenAI();

    // Generate BDD Test Cases
    const bddCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate Behavior-Driven Development (BDD) test cases based on the given software requirement. The output follows the Gherkin syntax.",
        },
        {
          role: "user",
          content: `Generate BDD test cases for the following requirement:
          ---
          ${topic}
          ---
          `,
        },
      ],
    });

    let bddTestCases = bddCompletion.choices[0].message.content;
    bddTestCases = bddTestCases.replace(/[\*#]/g, ""); // Remove special characters

    // Generate Step Definition File
    const stepDefCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate step definition functions in JavaScript for the given BDD scenarios. The functions should be reusable and properly formatted.",
        },
        {
          role: "user",
          content: `Based on the following BDD test cases, generate a JavaScript step definition file:
          ---
          ${bddTestCases}
          ---
          `,
        },
      ],
    });

    let stepDefinitions = stepDefCompletion.choices[0].message.content;

    // **Sanitize the Step Definition Output**
    stepDefinitions = stepDefinitions
      .replace(/```javascript/g, "") // Remove JS markdown formatting
      .replace(/```/g, "") // Remove closing code block
      .trim(); // Trim any leading/trailing spaces

    // **Check for existing test case and versioning**
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
        topic,
        jiraId,
        userId: user.sub,
        version,
        previousVersions: [],
        created: new Date(),
      });
    }

    // **Ensure valid project paths**
    if (!project.outputFeaturePath || !project.outputTestCasesPath) {
      return res.status(400).json({ error: "Project paths are not set correctly." });
    }

    const testCaseFileName = `testcase_${jiraId}_v${version}.feature`;
    const stepDefFileName = `step_definitions_${jiraId}_v${version}.js`;
    const testCaseFilePath = path.join(project.outputFeaturePath[0], testCaseFileName);
    const stepDefFilePath = path.join(project.outputTestCasesPath[0], stepDefFileName);

    // **Ensure directories exist**
    fs.mkdirSync(path.dirname(testCaseFilePath), { recursive: true });
    fs.mkdirSync(path.dirname(stepDefFilePath), { recursive: true });

    // **Write files**
    fs.writeFileSync(testCaseFilePath, bddTestCases, "utf8");
    fs.writeFileSync(stepDefFilePath, stepDefinitions, "utf8");

    console.log("BDD Test Case & Step Definitions saved:", { jiraId, version });

    res.status(200).json({
      message: "Test case and step definitions saved successfully",
      jiraId,
      version,
      files: {
        testCase: testCaseFilePath,
        stepDefinitions: stepDefFilePath,
      },
    });
  } catch (error) {
    console.error("Error generating BDD test cases and step definitions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
