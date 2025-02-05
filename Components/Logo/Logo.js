import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FaRobot } from "react-icons/fa";
import React from "react";
import Link from "next/link";


export default function Logo() {
  return <div className="text-3xl flex justify-center py-4 p-3 font-heading text-orange-500 hover:text-orange-700">
    <Link href={`/dashboard`}  >BDD Forge</Link> 
    <FaRobot  className="text-gray-200 ml-2 mt-0.5" />
    </div>;
}
