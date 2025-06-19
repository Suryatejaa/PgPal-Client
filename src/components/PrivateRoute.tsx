import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { clearUser } from "../features/auth/authSlice";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((state) => ({
    user: state.auth.user,
    isInitialized: state.auth.isInitialized,
  }));


 
  // Listen for auth expiration events from axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      console.log("🔴 Auth expired event received, clearing user state");
      dispatch(clearUser());
    };

    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [dispatch]);

  
  if (!isInitialized) {
    console.log("⏳ PrivateRoute: Waiting for auth session to be verified...");
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 font-medium">
            Verifying Your Session...
          </p>
        </div>
      </div>
    );
  }
  // If no user after cookies check, redirect to login
  if (!user) {
    console.log("🚪 No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User exists from cookies, render protected content
  // Let axios interceptor handle any token validation/refresh
  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
};

export default PrivateRoute;
