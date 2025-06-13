import React from "react";
import OwnerDashboard from "../../dashboard/pages/ownerDashboard";
import TenantDashboard from "../../dashboard/pages/tenantDashboard";
import AdminDashboard from "../../adminDashboard/pages/AdminDashboard";
import { useAppSelector } from "../../../app/hooks";
import { useNotificationSocket } from "../../../app/useNotificationSocket";

const Dashboard = () => {
  // Get user role from Redux or localStorage
  // Example: from Redux
  const user =
    useAppSelector((state) => state.auth.user) ||
    JSON.parse(localStorage.getItem("user") || "null");

  console.log(user);
  useNotificationSocket(user._id, user.role);

  if (user?.role === "owner")
    return (
      <OwnerDashboard
        userId={user._id}
        userName={user.name}
        userRole={user.role}
        userPpid={user.pgpalId}
        currentPlan={user.currentPlan}
        isTrialClaimed={user.isTrialClaimed} // Pass isTrialClaimed if needed
      />
    );
  else if (user?.role === "admin")
    return <AdminDashboard userId={user._id} userName={user.name} />;
  else if (user?.role === "tenant")
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
