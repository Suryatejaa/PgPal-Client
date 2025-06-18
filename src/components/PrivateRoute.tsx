import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { initializeAuth } from "../features/auth/authSlice";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loadingFromCookies);
  const [serverCheckDone, setServerCheckDone] = useState(false);

  console.log("PrivateRoute", { loading, user, serverCheckDone });

  useEffect(() => {
    // Only call initializeAuth if user exists locally but server check hasn't been done
    if (user && !serverCheckDone) {
      console.log("User found locally, verifying with server...");
      dispatch(initializeAuth()).finally(() => {
        setServerCheckDone(true);
      });
    } else if (!user) {
      // No user locally, no need for server check
      setServerCheckDone(true);
    }
  }, [dispatch, user, serverCheckDone]);

  // Show loading while checking auth
  if (loading || (user && !serverCheckDone)) {
    return <div className="w-full text-center py-10">Loading...</div>;
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
