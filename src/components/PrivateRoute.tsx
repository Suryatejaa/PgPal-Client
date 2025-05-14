import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

type Props = {
  children: React.ReactNode; // 👈 this is more flexible than ReactElement
};

const PrivateRoute = ({ children }:Props ) => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
