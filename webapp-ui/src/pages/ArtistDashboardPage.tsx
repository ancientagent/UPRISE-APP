import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBandData, deleteSongAsync } from '../store/bandSlice';
import { fetchEvents, deleteEventAsync } from '../store/eventSlice';
import { selectCurrentUser, selectCurrentToken } from '../store/selectors';
import SongUploadModal from '../components/SongUploadModal/SongUploadModal';
import SongSlot from '../components/SongSlot/SongSlot';
import EventCard from '../components/EventCard/EventCard';
import type { Song } from '../store/types';

const ArtistDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const { data: band, status, error } = useAppSelector((state) => state.band);
  const { events, status: eventsStatus, error: eventsError } = useAppSelector((state) => state.events);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [songToReplace, setSongToReplace] = useState<Song | null>(null);

  useEffect(() => {
    // First, check if the user profile has been loaded
    if (user) {
      // Now, check if the user has a band. 
      // If not, they shouldn't be on this page. Redirect them.
      if (!user.band || Object.keys(user.band).length === 0) {
        console.log('User has no band, redirecting to create one.');
        navigate('/create-band');
      } else if (token && status === 'idle') {
        // Only fetch band data if they have a band AND we haven't fetched it yet.
        dispatch(fetchBandData(token));
      }
      
      // Fetch events if we have a token and events haven't been loaded yet
      if (token && eventsStatus === 'idle') {
        dispatch(fetchEvents(token));
      }
    }
  }, [user, token, status, eventsStatus, dispatch, navigate]);

  const handleUploadSuccess = () => {
    // Refresh band data to show the new song
    if (token) {
      dispatch(fetchBandData(token));
    }
    setSongToReplace(null);
  };

  const handleReplaceSong = (song: Song) => {
    setSongToReplace(song);
    setIsModalOpen(true);
  };

  const handleDeleteSong = async (songId: string) => {
    if (!token) {
      alert('Authentication token is missing');
      return;
    }
    setDeletingSongId(songId);
    try {
      await dispatch(deleteSongAsync({ songId, token })).unwrap();
    } catch (error: any) {
      alert(`Failed to delete song: ${error.message || 'Unknown error'}`);
    } finally {
      setDeletingSongId(null);
    }
  };

  const handleAddSong = () => {
    setSongToReplace(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/event/${eventId}/edit`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!token) {
      alert('Authentication token is missing');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteEventAsync({ eventId, token })).unwrap();
    } catch (error: any) {
      alert(`Failed to delete event: ${error.message || 'Unknown error'}`);
    }
  };

  const renderSongSlots = () => {
    const songs = band?.songs || band?.band?.songs || [];
    const slots = [];
    songs.forEach((song: Song, index: number) => {
      if (index < 3) {
        slots.push(
          <SongSlot
            key={song.id}
            song={song}
            slotNumber={index + 1}
            onReplaceSong={handleReplaceSong}
            onDeleteSong={handleDeleteSong}
            isDeleting={deletingSongId === song.id}
          />
        );
      }
    });
    for (let i = songs.length; i < 3; i++) {
      slots.push(
        <div key={`empty-${i}`} className="song-slot" style={{ 
          border: '2px dashed #ccc', 
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h4>Slot {i + 1}</h4>
          <p>Empty</p>
          <button 
            onClick={handleAddSong}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Song
          </button>
        </div>
      );
    }
    return slots;
  };

  const renderEvents = () => {
    if (eventsStatus === 'loading') {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          border: '2px dashed #dee2e6',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#6c757d' }}>
            Loading events...
          </p>
        </div>
      );
    }

    if (eventsStatus === 'failed') {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '8px', 
          border: '2px dashed #dc3545',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#721c24' }}>
            Error loading events: {eventsError}
          </p>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          border: '2px dashed #dee2e6',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#6c757d' }}>
            No events created yet. Create your first event to engage with your community!
          </p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '12px' }}>
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>
    );
  };

  if (status === 'loading') return <div>Loading Dashboard...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  const bandTitle = band?.title || band?.band?.title || 'Artist Dashboard';
  const bandDescription = band?.description || band?.band?.description;
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>{bandTitle}</h2>
      <p>{bandDescription}</p>
      <hr />
      
      {/* Events Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Your Events</h3>
          <button 
            onClick={() => navigate('/create-event')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Create New Event
          </button>
        </div>
        {renderEvents()}
      </div>

      <h3>Rotation Stack</h3>
      <p>Manage your songs for the Fair Play system.</p>
      <div className="song-slots" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {renderSongSlots()}
        <div className="song-slot promo-slot" style={{ 
          border: '2px dashed #ff6b35', 
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fff5f2',
          position: 'relative'
        }}>
          <h4 style={{ color: '#ff6b35' }}>Promotional Ad Slot</h4>
          <p style={{ color: '#666' }}>10-second audio ad</p>
          <div style={{ 
            fontSize: '24px', 
            margin: '10px 0',
            color: '#ff6b35'
          }}>
            🔒
          </div>
          <button style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'not-allowed',
            opacity: 0.7
          }} disabled>
            Upgrade to Unlock
          </button>
        </div>
      </div>
      <SongUploadModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSongToReplace(null); }} 
        onUploadSuccess={handleUploadSuccess}
        songToReplace={songToReplace}
      />
    </div>
  );
};

export default ArtistDashboardPage; 