import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongAnalytics } from '../store/analyticsSlice';
import type { RootState } from '../store/store';
import { useSelector as useTypedSelector } from 'react-redux';
import type { CSSProperties } from 'react';

const thStyle: CSSProperties = { padding: 10, borderBottom: '2px solid #444', textAlign: 'left' };
const tdStyle: CSSProperties = { padding: 10, borderBottom: '1px solid #333' };

const AnalyticsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.analytics);
  const token = useTypedSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchSongAnalytics(token) as any);
    }
  }, [dispatch, token]);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#222', color: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Artist Analytics Dashboard</h2>
      {loading && <div>Loading analytics...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={thStyle}>Song Title</th>
              <th style={thStyle}>Play Count</th>
              <th style={thStyle}>Likes</th>
              <th style={thStyle}>Upvotes</th>
              <th style={thStyle}>Skips</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((song: any) => (
                <tr key={song.id} style={{ background: '#292929' }}>
                  <td style={tdStyle}>{song.title || song.name || '-'}</td>
                  <td style={tdStyle}>{song.playCount ?? song.plays ?? '-'}</td>
                  <td style={tdStyle}>{song.likes ?? '-'}</td>
                  <td style={tdStyle}>{song.upvotes ?? '-'}</td>
                  <td style={tdStyle}>{song.skips ?? '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>No analytics data found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyticsPage; 