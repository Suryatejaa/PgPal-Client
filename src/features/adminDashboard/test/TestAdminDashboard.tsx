// Test import to verify all components work together
import React from "react";
import AdminDashboard from "../pages/AdminDashboard";
import "../../../App.css"; // Adjust path as needed

const TestAdminDashboard: React.FC = () => {
  return (
    <div>
      <AdminDashboard userId="test-user" userName="Test User" />
    </div>
  );
};

export default TestAdminDashboard;
