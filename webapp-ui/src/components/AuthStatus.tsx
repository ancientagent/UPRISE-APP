import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCurrentUser, selectCurrentToken } from '../store/selectors';
import { logOut } from '../store/authSlice';

const AuthStatus: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch(logOut());
  };

  if (!user || !token) {
    return <div>Not logged in</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h3>Welcome, {user.firstName} {user.lastName}!</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.userName}</p>
        <p><strong>Role:</strong> {user.role.name}</p>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default AuthStatus; 