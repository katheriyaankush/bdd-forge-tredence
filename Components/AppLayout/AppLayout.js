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
    <div className="flex flex-col h-screen max-h-screen">
      {/* Top Bar */}
      <div className="bg-slate-800 text-white flex items-center justify-between px-4 shadow-lg">
        {/* Logo and Navigation Links */}
        <div className="flex items-center">
          <Logo />
        </div>
      
        {/* <div className="bg-slate-800 text-white flex items-center justify-between px-3 py-2 shadow-lg">
          <Link
            href="/dashboard/new"
            className="btn bg-orange-600 hover:bg-orange-700 rounded-lg py-2 px-4 text-sm font-semibold transition duration-300"
          >
            New Test Case
          </Link>
            </div> */}
         

        {/* Project Dropdown and User Profile */}

        <div className="flex items-center gap-6">
       
          {/* User Profile Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Image
                src={user.picture}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="font-bold text-sm">{user.email}</div>
                <Link
                  className="text-xs text-white hover:underline"
                  href="/api/auth/logout"
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/api/auth/login"
              className="text-white hover:underline text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 w-full overflow-auto bg-gray-50">
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