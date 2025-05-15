import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";

const OwnerDashboard: React.FC = () => {
    return (
      <div className="min-h-screen bg-white text-purple-700 p-6">
        <div className="fixed top-0 left-0 w-full bg-white z-10 px-6 py-4 shadow">
          <h1 className="text-4xl font-bold">👑 PGPAL Owner</h1>
        </div>
        <div className="pt-20">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-lg p-6">
            <OwnerProperties />
          </div>
        </div>
      </div>
    );
};

export default OwnerDashboard;
