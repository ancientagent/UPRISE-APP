import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) return; // Prevent multiple redirects

    // Based on the user roles spec, a user with a band will have a 'band' object.
    // We will assume for now that if the 'band' object is empty or doesn't exist, they need to create one.
    if (user && (!user.band || Object.keys(user.band).length === 0)) {
      // If the user is an artist but has no band, redirect to create one.
      // In a real app, we'd check their role first.
      setIsRedirecting(true);
      navigate('/create-band');
    } else if (user) {
      // If they have a band, go to their dashboard.
      setIsRedirecting(true);
      navigate('/dashboard');
    }
  }, [user, navigate, isRedirecting]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        {user ? 'Redirecting to your dashboard...' : 'Please wait...'}
      </div>
    </div>
  );
};

export default HomePage; 