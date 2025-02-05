import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppLayout from "../../Components/AppLayout/AppLayout";
import jiraData from "../../public/jiraData.json";
import clientPromise from "../../lib/mongodb";
import Markdown from "react-markdown";
import { getAppProps } from "../../utils/getAppProps";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import UploadBDDFeatureFile from '../../Components/Upload/UploadBDDFeatureFile'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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
  const [isOpen, setIsOpen] = useState(false);
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
  const handleVersion=()=>{
    setShowVersions(!showVersions)
    if(showVersions){
      setSelectedVersion(versions)
    }
  }
  return (
    <div className="p-2 overflow-auto h-full">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-2">
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
          onClick={() => handleVersion()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          {showVersions ? "Hide Versions" : "Show Versions"}
        </button>

         {
          showVersions && (
            <div className="relative w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border rounded bg-gray-100 text-left flex justify-between items-center focus:outline-none"
              >
                <span>
                  {selectedVersion ? `Version ${new Date(selectedVersion.updated).toLocaleString()}` : "Select a version"}
                </span>
                {isOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
              </button>
              {isOpen && (
                <div className="absolute w-full mt-1 bg-white border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                  {versions.previousVersions.map((version) => (
                    <div
                      key={version.version}
                      onClick={() => {
                        setSelectedVersion(version);
                        setIsOpen(false);
                      }}
                      className={`p-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center ${
                        selectedVersion.version === version.version ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      <span>Version {new Date(version.updated).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>)
         }
        <h1 className="text-2xl font-bold mt-4">BDD Test Cases</h1>
        <div className="mt-4 overflow-auto ">
          <Markdown className="py-5">{selectedVersion.bddTestCases}</Markdown>
        </div>
       
      </div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h1 className="text-2xl font-bold mt-4">Step Definitions</h1>
      <div className="mt-4 overflow-auto ">
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
