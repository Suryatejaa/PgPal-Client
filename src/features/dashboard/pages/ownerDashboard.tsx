import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";

const OwnerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">👑 PGPAL Owner</h1>
      <div className="bg-white/10 rounded-2xl shadow-lg p-6">
        <OwnerProperties />
      </div>
    </div>
  );
};

export default OwnerDashboard;
