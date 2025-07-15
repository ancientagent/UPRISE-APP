import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authService';

const RegistrationPage: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isArtist, setIsArtist] = useState(false); // This is the only role selector
  const [bandName, setBandName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = { userName, email, password, role: isArtist ? 'artist' : 'listener' };
      if (isArtist) {
        if (!bandName.trim()) {
          setError('Band name is required for artists.');
          setLoading(false);
          return;
        }
        payload.title = bandName.trim();
      }
      const response = await signup(payload);
      // Treat any 2xx response as success
      if (response || typeof response === 'object') {
        navigate('/login');
        return;
      }
      setError('Registration failed. Please try again.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register for UPRISE</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Artist Checkbox for role selection */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="isArtist" style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Register as Artist</label>
          <input
            type="checkbox"
            id="isArtist"
            checked={isArtist}
            onChange={(e) => setIsArtist(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              accentColor: 'red',
              marginRight: '10px',
              verticalAlign: 'middle',
              zIndex: 10000
            }}
          />
          <span style={{ color: 'white', fontSize: '16px', verticalAlign: 'middle' }}>Check if you are an Artist</span>
        </div>
        {isArtist && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="bandName" style={{ display: 'block', marginBottom: '5px', color: 'white' }}>
              Band Name:
            </label>
            <input
              type="text"
              id="bandName"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              required={isArtist}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="userName" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
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
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
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
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage; 