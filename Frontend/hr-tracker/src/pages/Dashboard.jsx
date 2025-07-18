import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getDashboardStats } from '../services/api'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalCallsToday: 0,
    Connected: 0,
    "Not Connected": 0,
    Shortlisted: 0,
    Rejected: 0,
    Interested: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { label: 'Total Candidates', value: stats.totalCandidates },
    { label: 'Calls Made Today', value: stats.totalCallsToday },
    { label: 'Connected', value: stats.Connected },
    { label: 'Not Connected', value: stats["Not Connected"] },
    { label: 'Shortlisted', value: stats.Shortlisted },
    { label: 'Rejected', value: stats.Rejected },
    { label: 'Interested', value: stats.Interested },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <div className="pt-20 px-6">
          <h1 className="text-2xl font-bold mb-6">Candidate Management Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="text-gray-600 text-sm">{card.label}</p>
                <h2 className="text-3xl font-semibold text-indigo-600 mt-2">{card.value}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
