import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logOut } from '../store/authSlice';
import { selectCurrentUser } from '../store/selectors';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('userToken');
    
    // Clear Redux state
    dispatch(logOut());
    
    // Redirect to login
    navigate('/login');
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Not authenticated</h2>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Welcome to UPRISE Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h3>User Information</h3>
        <div style={{ marginTop: '15px' }}>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Username:</strong> {user.userName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role.name}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Dashboard Features</h3>
        <p>This is where the main dashboard content will go.</p>
        <p>You can add:</p>
        <ul>
          <li>User management</li>
          <li>Band management</li>
          <li>Content management</li>
          <li>Event management</li>
          <li>Statistics and analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard; 