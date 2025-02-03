import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function UploadBDDFeatureFile({ jiraId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !jiraId) {
      alert("Please enter a JIRA ID and select a .feature file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("featureFile", file);
    formData.append("jiraId", jiraId);

    try {
      const res = await fetch(
        "http://localhost:3000/api/generateManualTestCases",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploading(false);
  };
  console.log("Response: ", response);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-xl font-bold mb-4">Upload BDD Feature File</h2>
      <input
        type="file"
        accept=".feature"
        onChange={handleFileChange}
        className="mb-4"
      />

      {uploading ? (
        <BeatLoader />
      ) : (
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          disabled={uploading}
        >
          Upload & Generate
        </button>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <p>✅ Upload successful!</p>
          <p>
            📂{" "}
            <a href={response.files.testCase} className="text-blue-600">
              View Test Case
            </a>
          </p>
          <p>
            📜{" "}
            <a href={response.files.stepDefinitions} className="text-blue-600">
              View Step Definitions
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
