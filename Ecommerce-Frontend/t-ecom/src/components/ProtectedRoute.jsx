import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppContext from "../Context/Context";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  return (
    <AppContext.Consumer>
      {({ isAuthenticated, currentUser }) => {
        if (!isAuthenticated) {
          return <Navigate to="/login" replace state={{ from: location }} />;
        }

        if (allowedRoles.length && !allowedRoles.includes(currentUser?.role)) {
          return <Navigate to="/unauthorized" replace />;
        }

        return children;
      }}
    </AppContext.Consumer>
  );
};

export default ProtectedRoute;
