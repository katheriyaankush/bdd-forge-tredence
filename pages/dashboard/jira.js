import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "../../Components/AppLayout/AppLayout";
import jiraData from "../../public/jiraData.json";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getAppProps } from "../../utils/getAppProps";
import BeatLoader from "react-spinners/BeatLoader";

const statusColors = {
  "To Do": "bg-gray-400",
  "In Progress": "bg-yellow-500",
  Done: "bg-green-500",
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
const JiraDashboard = () => {
  const [expanded, setExpanded] = useState({});
  const [visibleTickets, setVisibleTickets] = useState(6);
  const [tickets, setTickets] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [response, setResponse] = useState({});
  const router = useRouter();
  useEffect(() => {
    setTickets(jiraData);
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (topic, jiraId) => {
    setLoadingMap((prev) => ({ ...prev, [jiraId]: true }));
    const response = await fetch("http://localhost:3000/api/generateTestCases", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, jiraId }),
    });
    const data = await response.json();
    setResponse((prev) => ({ ...prev, [jiraId]: data }));
    console.log("Response:", response);
    // if (data.jiraId) {
    //   router.push(`/dashboard/${jiraId}`);
    // }
    setLoadingMap((prev) => ({ ...prev, [jiraId]: false }));
  };
  console.log("ResponseData:", response);
  return (
    <div className="p-6 overflow-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.slice(0, visibleTickets).map((ticket) => (
          <div key={ticket.id} className="p-4 shadow-lg rounded-2xl border">
            <Link
              href={`/dashboard/${ticket.id}`}
              className="block hover:underline"
            >
              <h2 className="text-lg font-bold">{ticket.summary}</h2>
            </Link>
            {loadingMap[ticket.id] ? (
              <div className="flex justify-center items-center">
                <BeatLoader  />
              </div>
            ) : (
              <button
                className="mt-6 px-2 py-1 bg-blue-600 block text-white rounded-sm text-xs mb-2"
                onClick={() => handleSubmit(ticket.summary, ticket.id)}
              >
                Generate BDD
              </button>
            )}
             {response[ticket.id] && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <p>✅ Upload successful!</p>
          <p>
            📂{" "}
            <a href={response[ticket.id].files.testCase} 
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Test Case
            </a>
          </p>
          <p>
            📜{" "}
            <a href={response[ticket.id].files.stepDefinitions} className="text-blue-600">
              View Step Definitions
            </a>
          </p>
        </div>
      )}
            <span
              className={`${
                statusColors[ticket.status] || "bg-gray-500"
              } text-white px-3 py-1 rounded-full text-xs`}
            >
              {ticket.status}
            </span>
            <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
            <div className="mt-4 text-sm">
              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>
              <p>
                <strong>Assignee:</strong>{" "}
                {ticket.assignee ? ticket.assignee.name : "Unassigned"}
              </p>
              <p>
                <strong>Reporter:</strong> {ticket.reporter.name}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              {Array.isArray(ticket.labels) &&
                ticket.labels.map((label) => (
                  <span
                    key={label}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                  >
                    {label}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
      {visibleTickets < jiraData.length && (
        <button
          className="mt-6 px-2 py-1 text-xs bg-orange-500 text-white rounded-sm"
          onClick={() => setVisibleTickets(visibleTickets + 6)}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default JiraDashboard;

JiraDashboard.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};
