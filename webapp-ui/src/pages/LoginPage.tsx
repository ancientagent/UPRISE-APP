import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';
import { login } from '../api/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      const response = await login(email, password);
      console.log('Login response:', response);
      
      // Handle different response structures
      let user, accessToken;
      
      if (response.data) {
        // Response has data wrapper
        user = response.data.user || response.data;
        accessToken = response.data.accessToken || response.data.token;
      } else {
        // Response is direct
        user = response.user || response;
        accessToken = response.accessToken || response.token;
      }
      
      console.log('Extracted user data:', user);
      console.log('Extracted token:', accessToken ? 'Token present' : 'No token');
      
      // Validate that we have the required data
      if (!user || !accessToken) {
        throw new Error('Invalid response format: missing user data or token');
      }
      
      // Store token in localStorage
        localStorage.setItem('userToken', accessToken);
      console.log('Token stored in localStorage');
      
      // Dispatch Redux action to save credentials
      dispatch(setCredentials({ user, accessToken }));
      console.log('Credentials dispatched to Redux store');
      
      // Small delay to ensure Redux state is updated
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }, 100);
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login to UPRISE</h2>
      {error && (
        <div style={{ 
          color: 'white', 
          backgroundColor: '#dc3545', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              opacity: loading ? 0.7 : 1
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              opacity: loading ? 0.7 : 1
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 