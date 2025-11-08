import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { Verified } from "lucide-react";


const AuthRoute = ({ children, type }) => {
  // const user = localStorage.getItem("user");
  const isVerified = useSelector((state) => state.auth.isAuthenticated);

  if (type === "protected") {
    return isVerified ? children : <Navigate to="/login" replace />;
  }

  if (type === "guest") {
    return !isVerified ? children : <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
