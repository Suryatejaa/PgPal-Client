import React from "react";
import OwnerProperties from "../../property/pages/OwnerProperties";

const OwnerDashboard: React.FC<{
  userId: string;
  userName: string;
  userRole: string;
}> = ({ userId, userName, userRole }) => {
  return (
    <div className="min-h-screen bg-white text-purple-700">
      <div className="fixed top-0 left-0 w-full bg-white z-10 px-6 py-1 shadow">
        <h1 className="text-4xl font-bold">👑PGPAL Owner</h1>
      </div>
      <div className="pt-10">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg p-2">
          <OwnerProperties
            userId={userId}
            userName={userName}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
