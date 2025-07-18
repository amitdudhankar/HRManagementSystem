// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />
        <div className="pt-20 px-6"> {/* Increased top padding to push content below fixed navbar */}
          <h1 className="text-2xl font-bold">Candidate Management Dashboard</h1>
          <p className="mt-4 text-gray-700">
            Welcome to the HR Dashboard. Here you can manage candidates and view reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
