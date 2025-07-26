import React, { useState, useEffect } from 'react';
import { uploadSong, replaceSong } from '../../api/songService';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentToken } from '../../store/selectors';
import type { Song } from '../../store/types';
import api from '../../api/api';

interface SongUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  songToReplace?: Song | null;
}

const SongUploadModal: React.FC<SongUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUploadSuccess,
  songToReplace = null
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Array<{id: number, name: string}>>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const token = useAppSelector(selectCurrentToken);

  // Load available genres when modal opens
  useEffect(() => {
    if (isOpen && availableGenres.length === 0) {
      loadGenres();
    }
  }, [isOpen]);

  // Prefill title in replace mode
  useEffect(() => {
    if (songToReplace) {
      setTitle(songToReplace.title || '');
    } else {
      setTitle('');
    }
    setFile(null);
    setThumbnail(null);
    setSelectedGenres([]);
    setError('');
  }, [songToReplace, isOpen]);

  const loadGenres = async () => {
    if (!token) return;
    
    setIsLoadingGenres(true);
    try {
      const response = await api.get('/onboarding/all-genres', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableGenres(response.data.data || []);
    } catch (error) {
      console.error('Failed to load genres:', error);
      setError('Failed to load genres. Please try again.');
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const handleGenreChange = (genreName: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreName)) {
        return prev.filter(g => g !== genreName);
      } else if (prev.length < 3) {
        return [...prev, genreName];
      }
      return prev;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a song title');
      return;
    }

    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
      return;
    }

    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      if (songToReplace) {
        // Replace mode
        await replaceSong(songToReplace.id, file, title, selectedGenres, token, thumbnail || undefined);
      } else {
        // Add mode
        await uploadSong(file, title, selectedGenres, token, thumbnail || undefined);
      }
      setFile(null);
      setThumbnail(null);
      setTitle('');
      setSelectedGenres([]);
      onUploadSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Failed to upload song';
      if (errorMessage.includes('does not have a band')) {
        setError('You need to create a band first. Please contact support to set up your artist profile.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setTitle('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
          {songToReplace ? `Replace Song: ${songToReplace.title}` : 'Upload Song'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Audio File *
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={isUploading}
            />
            {file && (
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                Selected: {file.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Album Art (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={isUploading}
            />
            {thumbnail && (
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                Selected: {thumbnail.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Song Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={isUploading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Genres * (Select up to 3)
            </label>
            {isLoadingGenres ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Loading genres...</p>
            ) : (
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                padding: '8px'
              }}>
                {availableGenres.map((genre) => (
                  <label key={genre.id} style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.name)}
                      onChange={() => handleGenreChange(genre.name)}
                      disabled={isUploading}
                      style={{ marginRight: '8px' }}
                    />
                    {genre.name}
                  </label>
                ))}
              </div>
            )}
            {selectedGenres.length > 0 && (
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                Selected: {selectedGenres.join(', ')}
              </p>
            )}
          </div>

          {error && (
            <div style={{
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1
              }}
            >
              {isUploading ? (songToReplace ? 'Replacing...' : 'Uploading...') : (songToReplace ? 'Replace Song' : 'Upload Song')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongUploadModal; 