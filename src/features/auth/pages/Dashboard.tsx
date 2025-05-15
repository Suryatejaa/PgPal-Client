import React from "react";
import OwnerDashboard from "../../dashboard/pages/ownerDashboard";
import TenantDashboard from "../../dashboard/pages/tenantDashboard";
import { useAppSelector } from "../../../app/hooks";

const Dashboard = () => {
  // Get user role from Redux or localStorage
  // Example: from Redux
  const role =
    useAppSelector((state) => state.auth.user?.role) ||
    localStorage.getItem("role");

  if (role === "owner") return <OwnerDashboard />;
  return <TenantDashboard />;
};

export default Dashboard;
