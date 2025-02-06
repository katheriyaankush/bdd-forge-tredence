import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { topic, jiraId } = req.body;
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("tredence");

    // ✅ Fetch the user's project
    const project = await db.collection("projects").findOne({ userId: user.sub });

    if (!project) {
      return res.status(404).json({ error: "Project not found for the user" });
    }

    const projectId = project._id.toString();
    const projectName = project.projectName[0].replace(/\s+/g, "-").toLowerCase();
    const userName = user.name.replace(/\s+/g, "-").toLowerCase();

    const openai = new OpenAI();

    // ✅ Generate BDD Test Cases
    const bddCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate BDD test cases based on the given requirement. The output follows the Gherkin syntax.",
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

    let bddTestCases = bddCompletion.choices[0].message.content.replace(/[\*#]/g, "");

    // ✅ Generate Step Definitions
    const stepDefCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate step definition functions in JavaScript for the given BDD scenarios. The functions should be reusable and well-structured.",
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

    let stepDefinitions = stepDefCompletion.choices[0].message.content
      .replace(/```javascript/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Find existing test case for the user + project + Jira ID
    const existingTestCase = await db.collection("testcases").findOne({ 
      userId: user.sub, 
      jiraId, 
      projectId 
    });

    let version = 1;
    if (existingTestCase) {
      version = existingTestCase.version + 1;
      await db.collection("testcases").updateOne(
        { userId: user.sub, jiraId, projectId },
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
        projectId,
        userId: user.sub,
        version,
        previousVersions: [],
        created: new Date(),
      });
    }

    // ✅ Ensure valid project paths
    if (!project.outputFeaturePath || !project.outputTestCasesPath || !project.gitRepoUrl) {
      return res.status(400).json({ error: "Project paths or GitHub repository URL are missing." });
    }

    // ✅ **Updated File Naming Format**
    const testCaseFileName = `testcase_${projectName}_${userName}_${jiraId}_v${version}.feature`;
    const stepDefFileName = `step_definitions_${projectName}_${userName}_${jiraId}_v${version}.js`;

    const testCaseFilePath = path.join(project.outputFeaturePath[0], testCaseFileName);
    const stepDefFilePath = path.join(project.outputTestCasesPath[0], stepDefFileName);

    // ✅ Ensure directories exist
    fs.mkdirSync(path.dirname(testCaseFilePath), { recursive: true });
    fs.mkdirSync(path.dirname(stepDefFilePath), { recursive: true });

    // ✅ Write files
    fs.writeFileSync(testCaseFilePath, bddTestCases, "utf8");
    fs.writeFileSync(stepDefFilePath, stepDefinitions, "utf8");

    console.log("BDD & Step Definitions saved:", { jiraId, projectId, version });

    // 🔹 **GitHub Auto-Push Functionality**
    const git = simpleGit({ baseDir: "/Users/macbook/Documents/TRAFT" });
    try {
      // ✅ Initialize repository if not already initialized
      console.log("1==", await git.checkIsRepo())
      if (!(await git.checkIsRepo())) {
        await git.init();
        await git.addRemote("origin", project.gitRepoUrl[0]);
      }

      // ✅ Add, Commit, and Push changes
      await git.add([testCaseFilePath, stepDefFilePath]);
      await git.commit(`Added BDD & Step Definitions for ${jiraId} (Version ${version})`);
      await git.push("origin", "master"); // Change branch if necessary

    } catch (gitError) {
      console.error("Git Push Failed:", gitError);
    }

    res.status(200).json({
      message: "Test case and step definitions saved & pushed to GitHub successfully",
      jiraId,
      projectId,
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
