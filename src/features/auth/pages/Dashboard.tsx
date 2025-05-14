import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { logoutUser } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Wait for the logout to complete
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome, {user?.username || "Guest"} 👋</h1>
      <p>
        You are logged in as: <strong>{user?.role}</strong>
      </p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
