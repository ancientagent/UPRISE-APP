import React from 'react';
import type { Song } from '../../store/types';

interface SongSlotProps {
  song: Song;
  slotNumber: number;
  onReplaceSong: (song: Song) => void;
  onDeleteSong: (songId: string) => void;
  isDeleting?: boolean;
}

const SongSlot: React.FC<SongSlotProps> = ({ 
  song, 
  slotNumber, 
  onReplaceSong, 
  onDeleteSong,
  isDeleting = false
}) => {
  const formatDuration = (duration?: number) => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      onDeleteSong(song.id);
    }
  };

  return (
    <div className="song-slot" style={{ 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
      <h4>Slot {slotNumber}</h4>
      <div style={{ marginBottom: '15px' }}>
        <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{song.title}</h5>
        {song.duration && (
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            Duration: {formatDuration(song.duration)}
          </p>
        )}
        {song.cityName && song.stateName && (
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
            {song.cityName}, {song.stateName}
          </p>
        )}
        {song.live !== undefined && (
          <span style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: song.live ? '#28a745' : '#6c757d',
            color: 'white',
            marginTop: '5px'
          }}>
            {song.live ? 'LIVE' : 'DRAFT'}
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={() => onReplaceSong(song)}
          disabled={isDeleting}
          style={{ 
            padding: '6px 12px', 
            backgroundColor: '#ffc107', 
            color: '#212529', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            opacity: isDeleting ? 0.7 : 1
          }}
        >
          Replace Song
        </button>
        <button 
          onClick={handleDeleteClick}
          disabled={isDeleting}
          style={{ 
            padding: '6px 12px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            opacity: isDeleting ? 0.7 : 1
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Song'}
        </button>
      </div>
    </div>
  );
};

export default SongSlot; 