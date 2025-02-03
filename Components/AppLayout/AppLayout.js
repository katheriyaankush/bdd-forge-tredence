import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronRight, ArrowLeft } from "lucide-react";
import Logo from "../Logo/Logo";

export default function AppLayout({ children, projects }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathSegments = router.pathname.split("/").filter(Boolean);
  console.log("Path", router.pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      {/* Sidebar */}
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2 py-4">
          <Logo />
          <Link
            href="/dashboard/new"
            className="btn mt-4 block text-center bg-orange-600 hover:bg-orange-700 rounded-lg py-2"
          >
            New Test Case
          </Link>
        </div>

        {/* Project Dropdown */}
        <div className="px-4 py-6 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center justify-between w-full px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="font-semibold">Projects</span>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-full bg-cyan-700 text-white rounded-lg shadow-lg overflow-hidden z-10"
                >
                  {projects && projects.length > 0 ? (
                    projects.map((project, i) => (
                      <Link
                        key={i}
                        href={`/dashboard/${project}`}
                        className="block px-4 py-2 hover:bg-cyan-500 hover:text-white transition duration-300"
                      >
                        {project}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-500">
                      No projects available
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-4">
          {user ? (
            <>
              <Image
                src={user.picture}
                alt={user.name}
                width={45}
                height={45}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link
                  className="text-sm text-white hover:underline"
                  href="/api/auth/logout"
                >
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login" className="text-white hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 w-full overflow-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-gray-600 text-sm">
          {/* Back Button */}
          {pathSegments.length > 0 && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {/* Breadcrumb Links */}
          {pathSegments.map((segment, index) => {
            // Replace dynamic placeholders with actual values
            let segmentText = segment;
            if (segment === "[jiraId]" && router.query.jiraId) {
              segmentText = router.query.jiraId;
            }

            // Construct breadcrumb path
            const breadcrumbPath = `/${pathSegments
              .slice(0, index + 1)
              .join("/")}`;

            return (
              <div key={index} className="flex items-center">
                <ChevronRight size={14} className="text-gray-400 mx-2" />
                <Link
                  href={breadcrumbPath}
                  className="hover:underline capitalize"
                >
                  {segmentText.replace(/-/g, " ")}
                </Link>
              </div>
            );
          })}
        </div>
        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
