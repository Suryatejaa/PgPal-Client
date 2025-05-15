// src/pages/dashboards/TenantDashboard.tsx
import React from "react";

const TenantDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🏠 PGPAL Tenant</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Rent Due" value="₹3,750" />
        <DashboardCard title="Room No." value="B-102" />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Notices 📋</h2>
        <ul className="space-y-2">
          <li className="bg-white/10 p-4 rounded-xl">
            📦 Parcel room closed after 9PM
          </li>
          <li className="bg-white/10 p-4 rounded-xl">
            🎉 Hostel Day on 28th May
          </li>
        </ul>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white/10 p-6 rounded-2xl shadow-lg">
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default TenantDashboard;
