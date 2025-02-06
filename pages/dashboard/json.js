import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppLayout from "../../Components/AppLayout/AppLayout";
import jiraData from "../../public/jiraData.json";
import { useRouter } from "next/router";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import BeatLoader from "react-spinners/BeatLoader";
import clientPromise from "../../lib/mongodb";
import { FaSearch } from "react-icons/fa";

const statusColors = {
  "To Do": "bg-gray-400",
  "In Progress": "bg-yellow-500",
  Done: "bg-green-500",
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const { user } = await getSession(ctx.req, ctx.res);
      const client = await clientPromise;
      const db = client.db("tredence");

      const project = await db
        .collection("projects")
        .findOne({ userId: user.sub });
      //console.log("pro==", project)
      return {
        props: {
          project: project ? JSON.parse(JSON.stringify(project)) : null,
        },
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      return { props: { project: null } };
    }
  },
});
const JiraDashboard = ({ project }) => {
  const [visibleTickets, setVisibleTickets] = useState(6);
  const [tickets, setTickets] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [response, setResponse] = useState({});

  const [filters, setFilters] = useState({});
  const debounce = useCallback(
    debounceCreate((searchText) => setFilters({ ...filters, searchText })),
    []
  );

  const router = useRouter();

  useEffect(() => {
    console.log("File", JSON.parse(project.configFile));
    setTickets(JSON.parse(project.configFile));
  }, [project.configFile]);

  function filterData(data, filters) {
    let updatedData = [...data];
    if (filters.hasOwnProperty("searchText")) {
      updatedData = updatedData.filter(
        (entry) =>
          entry["description"]
            .toLowerCase()
            .includes(filters["searchText"].toLowerCase()) ||
          entry["summary"]
            .toLowerCase()
            .includes(filters["searchText"].toLowerCase())
      );
    }
    return updatedData;
  }

  const handleSubmit = async (topic, jiraId) => {
    setLoadingMap((prev) => ({ ...prev, [jiraId]: true }));
    const response = await fetch(
      "http://localhost:3000/api/generateTestCases",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ topic, jiraId }),
      }
    );
    const data = await response.json();
    setResponse((prev) => ({ ...prev, [jiraId]: data }));
    setLoadingMap((prev) => ({ ...prev, [jiraId]: false }));
  };
  console.log("ResponseData:", response);
  return (
    <div className="p-1 overflow-auto h-full">
      <div className="my-2 relative">
        <input
          className=" border-[1px] border-black p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
          type="search"
          onChange={(e) => debounce(e.target.value)}
          placeholder="Search..."
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FaSearch className="w-5 h-5" />
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterData(tickets, filters)
          .slice(0, visibleTickets)
          .map((ticket) => (
            <div key={ticket.id} className="p-4 shadow-lg rounded-2xl border">
              <Link
                href={`/dashboard/${ticket.id}`}
                className="block hover:underline"
              >
                <h2 className="text-lg font-bold">{ticket.summary}</h2>
              </Link>
              {loadingMap[ticket.id] ? (
                <div className="flex justify-center items-center">
                  <BeatLoader />
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
                <div className=" bg-green-100 text-green-800 rounded">
                  <p>✅ Generate successful!</p>
                </div>
              )}
              <span
                className={
                  "bg-gray-700 text-white px-3 py-1 rounded-full text-xs"
                }
              >
                #{ticket.id}
              </span>
              <span
                className={`${
                  statusColors[ticket.status] || "bg-gray-500"
                } text-white px-3 py-1 rounded-full text-xs ml-3 `}
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

function debounceCreate(addToFilter) {
  let id;

  return (searchText) => {
    clearTimeout(id);
    id = setTimeout(() => {
      addToFilter(searchText);
    }, 250);
  };
}
