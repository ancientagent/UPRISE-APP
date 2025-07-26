import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/selectors';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    // Simple redirect to dashboard for authenticated users
    if (user) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    } else {
      console.log('No user found, redirecting to welcome');
      navigate('/welcome', { replace: true });
    }
  }, [user, navigate]);

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
        {user ? 'Redirecting to your dashboard...' : 'Redirecting to welcome page...'}
      </div>
    </div>
  );
};

export default HomePage; 