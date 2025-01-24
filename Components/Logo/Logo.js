import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Logo() {
  return <div className="text-3xl text-center py-4 font-heading">
    Blog.AI
    <FontAwesomeIcon icon={faBrain} className="px-2 text-2xl text-slate-400"></FontAwesomeIcon>
    </div>;
}
