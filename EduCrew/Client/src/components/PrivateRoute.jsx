import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // If there's no user, redirect to sign-in while saving the attempted URL
  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If there is a user, render the protected route
  return <Outlet />;
};

export default PrivateRoute;