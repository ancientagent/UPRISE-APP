import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser, selectCurrentToken } from '../store/selectors';
import { isTokenValid } from '../utils/authUtils';

const RequireAuth: React.FC = () => {
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Validate token and user data
    const validateAuth = async () => {
      if (token) {
        const isValid = isTokenValid(token);
        if (!isValid) {
          // Token is invalid, clear it
          localStorage.removeItem('userToken');
          console.log('Invalid token detected, redirecting to login');
        }
      }
      setIsValidating(false);
    };

    validateAuth();
  }, [token]);

  // Show loading while validating
  if (isValidating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Validating authentication...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Please wait...</div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = token && user && isTokenValid(token);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  console.log('User authenticated, rendering protected routes');
  return <Outlet />;
};

export default RequireAuth; 