import React, { useState } from "react";
import Link from "next/link";
import AppLayout from "../../Components/AppLayout/AppLayout";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getAppProps } from "../../utils/getAppProps";
import { motion } from "framer-motion";
import { FaRobot, FaMagic, FaBolt } from "react-icons/fa";
import PopupForm from "../../Components/ProjectForm/PopupForm";
import clientPromise from "../../lib/mongodb";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    try {
      const { user } = await getSession(ctx.req, ctx.res);
      const client = await clientPromise;
      const db = client.db("tredence");

      const project = await db.collection("projects").findOne({ userId: user.sub });
      console.log("Project", project)
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

export default function Home({project}) {
  const [showForm, setShowForm] = useState(false);
  const handleFormSubmit = () => {
    setShowForm(false);
    window.location.href = `/dashboard/${project.tool}`;
  };

  return (
    <div className=" bg-white text-gray-900">
      {/* Hero Section */}
      <header className="text-center py-8 px-1">
        <motion.h1
          className="text-5xl font-bold leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Elevate Your Ideas with{" "}
          <motion.span
            className="text-orange-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            AI-Powered
          </motion.span>{" "}
          Innovation
        </motion.h1>
        <motion.p
          className="mt-4 text-lg opacity-80"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          Experience the future of automation and creativity with cutting-edge AI solutions.
        </motion.p>
        <motion.div
          className="mt-6 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          { project && <Link
            href={`/dashboard/${project.tool}`}
            className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 transition rounded-xl shadow-lg text-white"
          >
            Project
          </Link>}
          <button
            className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 transition rounded-xl shadow-lg text-white"
            onClick={() => setShowForm(true)}
          >
            Project Configuration
          </button>
          {/* <Link
            href="/dashboard/new"
            className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 transition rounded-xl shadow-lg text-white"
          >
            New Test Case
          </Link> */}
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="py-10 px-10 grid md:grid-cols-3 gap-8 text-center">
        <FeatureCard
          icon={<FaRobot />}
          title="AI Automation"
          description="Automate tasks effortlessly and boost productivity with AI-driven workflows."
        />
        <FeatureCard
          icon={<FaMagic />}
          title="Creative AI"
          description="Unleash AI-powered creativity for design, content, and more."
        />
        <FeatureCard
          icon={<FaBolt />}
          title="Speed & Efficiency"
          description="Supercharge your business with ultra-fast AI processing."
        />
      </section>

      {showForm && <PopupForm onClose={() => setShowForm(false)} onSubmit={handleFormSubmit}  project={project}/>}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="bg-gray-50 p-6 hover:bg-gray-200 rounded-2xl shadow-lg border border-gray-200"
      initial={{ y: 0 }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-blue-500 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="opacity-70 mt-2">{description}</p>
    </motion.div>
  );
}

Home.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};