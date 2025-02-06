import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing for file uploads
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

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse the form data
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    const [fields, files] = await form.parse(req);
    const file = files.configFile?.[0];
    
    let configFile = "";
    let filePath;
    if (file) {
         filePath = file.filepath; // Path where Formidable saved the file
        if (!fs.existsSync(filePath)) {
          return res.status(500).json({ error: "File was not saved correctly" });
        }
    
         configFile = fs.readFileSync(filePath, "utf8");
    }

    

    const { tool, projectName, outputTestCasesPath, outputFeaturePath, gitRepoUrl } = fields;

    // Prepare the project data
    const projectData = {
      userId: user.sub, // Unique identifier for the user
      tool,
      projectName,
      gitRepoUrl,
      configFile,
      outputTestCasesPath,
      outputFeaturePath,
      updated: new Date(), // Track the last update time
    };

    // Update the existing document or insert a new one if it doesn't exist
    const result = await db.collection("projects").updateOne(
      { userId: user.sub }, // Query to find the document for the user
      { $set: projectData }, // Update the document with the new data
      { upsert: true } // Insert a new document if no match is found
    );

    // Clean up the uploaded file after processing
    if (file) {
        fs.unlinkSync(filePath);
    }
   

    res.status(200).json({ message: "Project saved successfully", projectData });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});