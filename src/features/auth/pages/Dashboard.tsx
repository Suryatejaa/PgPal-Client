import React from "react";
import OwnerDashboard from "../../dashboard/pages/ownerDashboard";
import TenantDashboard from "../../dashboard/pages/tenantDashboard";
import { useAppSelector } from "../../../app/hooks";
import { useNotificationSocket } from "../../../app/useNotificationSocket";

const Dashboard = () => {
  // Get user role from Redux or localStorage
  // Example: from Redux
  const user =
    useAppSelector((state) => state.auth.user) ||
    JSON.parse(localStorage.getItem("user") || "null");

  console.log(user.role);
  useNotificationSocket(user._id, user.role);

  if (user?.role === "owner")
    return (
      <OwnerDashboard
        userId={user._id}
        userName={user.name}
        userRole={user.role}
        userPpid={user.pgpalId}
      />
    );
  return (
    <TenantDashboard
      userId={user._id}
      userName={user.name}
      userRole={user.role}
      userPpid={user.pgpalId}
    />
  );
};

export default Dashboard;
