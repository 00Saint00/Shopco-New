import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { Verified } from "lucide-react";

const AuthRoute = ({ children, type }) => {
  const isVerified = useSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  // Check localStorage on mount (before Redux loads)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    setHasUser(!!(savedUser && savedToken));
    setIsLoading(false);
  }, []);

  // Show loading state while checking
  if (isLoading) {
    return null; // or a loading spinner
  }

  // Use Redux state if available, otherwise fallback to localStorage check
  const isAuthenticated = isVerified || hasUser;

  if (type === "protected") {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

  if (type === "guest") {
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
