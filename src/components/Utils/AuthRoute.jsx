import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, type }) => {
  const user = localStorage.getItem("user");

  if (type === "protected") {
    return user ? children : <Navigate to="/login" replace />;
  }

  if (type === "guest") {
    return !user ? children : <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
