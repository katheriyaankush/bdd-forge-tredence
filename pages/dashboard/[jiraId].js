import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppLayout from "../../Components/AppLayout/AppLayout";
import jiraData from "../../public/jiraData.json";
import clientPromise from "../../lib/mongodb";
import Markdown from "react-markdown";
import { getAppProps } from "../../utils/getAppProps";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import UploadBDDFeatureFile from '../../Components/Upload/UploadBDDFeatureFile'

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { projects } = await getAppProps(ctx);
    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("tredence");
    const userId = user.sub;
    const jiraId = ctx.params.jiraId;

    const versions = await db
      .collection("testcases")
      .find({ jiraId })
      .sort({ created: -1 })
      .toArray();
    if (!versions.length) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        versions: JSON.parse(JSON.stringify(versions[0])),
        jiraId,
        projects
      },
     
    };
  },
});

const JiraTicketPage = ({ versions, jiraId }) => {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(versions);
  const [showVersions, setShowVersions] = useState(false);
  console.log("JIRA+Po==", selectedVersion,  versions.previousVersions);


  useEffect(() => {
    if (jiraId) {
      const filterData = jiraData.find((ticket) => ticket.id === jiraId);
      setTicket(filterData);
    }
  }, [jiraId]);

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-2 overflow-auto h-full">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
        <h1 className="text-2xl font-bold mb-4">{ticket.summary}</h1>
        <p className="text-gray-600">{ticket.description}</p>
        <div className="mt-4">
          <p>
            <strong>Status:</strong>{" "}
            <span className="bg-yellow-500 text-white px-2 py-1 rounded">
              {ticket.status}
            </span>
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Assignee:</strong>{" "}
            {ticket.assignee ? ticket.assignee.name : "Unassigned"}
          </p>
          <p>
            <strong>Reporter:</strong> {ticket.reporter?.name}
          </p>
        </div>
        <div className="mt-4">
          <strong>Labels:</strong>
          <div className="flex gap-2 mt-1">
            {ticket.labels.map((label) => (
              <span
                key={label}
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold">Comments</h3>
          {ticket.comments.length > 0 ? (
            ticket.comments.map((comment, index) => (
              <div key={index} className="mt-2 p-3 border rounded">
                <p className="font-semibold">{comment.author}:</p>
                <p>{comment.body}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
      <UploadBDDFeatureFile jiraId={jiraId}/>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      
        <button
          onClick={() => setShowVersions(!showVersions)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          {showVersions ? "Hide Versions" : "Show Versions"}
        </button>

        {showVersions && (
          <div className="space-y-2">
            {
              versions.previousVersions.map((version) => {
                console.log("Versonn=", version);
                return (
                  <button
                    key={version.version}
                    onClick={() => setSelectedVersion(version)}
                    className={`block w-full p-2 text-left border rounded ${
                      selectedVersion.version === version.version
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Version {new Date(version.updated).toLocaleString()}
                  </button>
                );
              })}
          </div>
        )}
        <h1 className="text-2xl font-bold mt-4">BDD Test Cases</h1>
        <div className="mt-4">
          <Markdown className="py-5">{selectedVersion.bddTestCases}</Markdown>
        </div>
       
      </div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h1 className="text-2xl font-bold mt-4">Step Definitions</h1>
      <div className="mt-4">
          <Markdown className="py-5">{selectedVersion.stepDefinitions}</Markdown>
        </div>
      </div>
    </div>
  );
};

JiraTicketPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default JiraTicketPage;
