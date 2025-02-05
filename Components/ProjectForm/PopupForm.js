import React, { useState } from "react";

const PopupForm = ({ onClose, onSubmit, project }) => {
  const [tool, setTool] = useState(project.tool);
  const [projectName, setProjectName] = useState(project.projectName);
  const [configFile, setConfigFile] = useState(null);
  const [outputFeaturePath, setOutputFeaturePath] = useState(project.outputFeaturePath);
  const [outputTestCasesPath, setOutputTestCasesPath] = useState(project.outputTestCasesPath);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("tool", tool);
    formData.append("projectName", projectName);
    formData.append("configFile", configFile);
    formData.append("outputTestCasesPath", outputTestCasesPath);
    formData.append("outputFeaturePath", outputFeaturePath);

    try {
      const response = await fetch("http://localhost:3000/api/saveProject", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onSubmit();
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Project Configuration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Project Management Tool</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              required
            >
              <option value="">Select a tool</option>
              <option value="jira">Jira</option>
              <option value="GitHub">GitHub</option>
              <option value="Azure">Azure</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Configuration File</label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setConfigFile(e.target.files[0])}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Feature Path</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={outputFeaturePath}
              onChange={(e) => setOutputFeaturePath(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Step Definitions Path</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={outputTestCasesPath}
              onChange={(e) => setOutputTestCasesPath(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;