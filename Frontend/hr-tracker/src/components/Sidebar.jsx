import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0 flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">HR Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 p-2 rounded"
              : "p-2 hover:bg-gray-700 rounded"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 p-2 rounded"
              : "p-2 hover:bg-gray-700 rounded"
          }
        >
          Candidates
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
