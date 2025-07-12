import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to UPRISE</h2>
      <p>Your music community platform</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ 
          textDecoration: 'none', 
          color: 'white', 
          backgroundColor: '#007bff', 
          padding: '10px 20px', 
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          Login
        </Link>
        <Link to="/register" style={{ 
          textDecoration: 'none', 
          color: 'white', 
          backgroundColor: '#28a745', 
          padding: '10px 20px', 
          borderRadius: '4px'
        }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage; 