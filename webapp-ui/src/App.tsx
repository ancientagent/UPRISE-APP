import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectCurrentUser, selectCurrentToken } from './store/selectors';
import { logOut } from './store/authSlice';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';
import CreateBandPage from './pages/CreateBandPage';
import ArtistDashboardPage from './pages/ArtistDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import WelcomePage from './pages/WelcomePage';
import RequireAuth from './components/RequireAuth';
import AnalyticsPage from './pages/AnalyticsPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();
  const isAuthenticated = !!token && !!user;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    dispatch(logOut());
    console.log('User logged out');
  };

  return (
    <ErrorBoundary>
    <Router>
      <div>
        <nav style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>UPRISE Webapp</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <li><Link to="/welcome" style={{ textDecoration: 'none', color: '#007bff' }}>Welcome</Link></li>
              
              {/* Show login/register only when not authenticated */}
              {!isAuthenticated ? (
                <>
            <li><Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>Login</Link></li>
            <li><Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Register</Link></li>
                </>
              ) : (
                <>
                  {/* Show authenticated user links */}
                  <li><Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Dashboard</Link></li>
            <li><Link to="/create-band" style={{ textDecoration: 'none', color: '#007bff' }}>Create Band</Link></li>
            <li><Link to="/create-event" style={{ textDecoration: 'none', color: '#007bff' }}>Create Event</Link></li>
            <li><Link to="/analytics" style={{ textDecoration: 'none', color: '#007bff' }}>Analytics</Link></li>
                  <li style={{ marginLeft: 'auto' }}>
                    <span style={{ color: '#666', fontSize: '14px', marginRight: '15px' }}>
                      Welcome, {user?.firstName || user?.userName || 'User'}!
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          
          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<ArtistDashboardPage />} />
            <Route path="/create-band" element={<CreateBandPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/event/:eventId/edit" element={<CreateEventPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          
          <Route path="/welcome" element={<WelcomePage />} />
        </Routes>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
