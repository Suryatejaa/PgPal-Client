import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loadingFromCookies);
  console.log("PrivateRoute", { loading, user });
  if (loading)
    return <div className="w-full text-center py-10">Loading...</div>;  

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
