import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentToken } from '../store/selectors';

const RequireAuth: React.FC = () => {
  const token = useAppSelector(selectCurrentToken);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default RequireAuth; 