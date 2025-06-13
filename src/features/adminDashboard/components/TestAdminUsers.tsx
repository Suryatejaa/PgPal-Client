import React from "react";
import AdminDashboard from "../pages/AdminDashboard";

const TestAdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard userId="admin123" userName="Admin User" />
    </div>
  );
};

export default TestAdminDashboard;
