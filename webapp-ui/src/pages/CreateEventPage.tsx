import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectCurrentToken } from '../store/selectors';
import { createEvent, updateEvent, getEventById, type CreateEventData, type Event } from '../api/eventService';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const token = useAppSelector(selectCurrentToken);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    venue: '',
    location: '',
    startDate: '',
    endDate: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditMode = !!eventId;

  // Fetch event data if in edit mode
  useEffect(() => {
    if (isEditMode && token && eventId) {
      setIsLoading(true);
      getEventById(eventId, token)
        .then((event: Event) => {
          setFormData({
            title: event.title,
            description: event.description,
            venue: event.venue,
            location: event.location,
            startDate: event.startDate.slice(0, 16), // Format for datetime-local input
            endDate: event.endDate.slice(0, 16),
          });
          if (event.thumbnail) {
            setExistingThumbnail(event.thumbnail);
          }
        })
        .catch((err: any) => {
          setError(err.message || 'Failed to load event data');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isEditMode, token, eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setExistingThumbnail(null); // Clear existing thumbnail when new file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Authentication token is missing');
      return;
    }

    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.venue.trim()) {
      setError('Venue is required');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Start date and end date are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const eventData: CreateEventData = {
        ...formData,
        thumbnail: thumbnail || undefined
      };

      if (isEditMode && eventId) {
        await updateEvent(eventId, eventData, token);
      } else {
        await createEvent(eventData, token);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} event`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <p>Loading event data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h2>{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter event title"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your event..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Venue *
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            placeholder="Enter venue name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location (city, state)"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Start Date *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              End Date *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Event Flyer/Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          {thumbnail && (
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
              Selected: {thumbnail.name}
            </p>
          )}
          {existingThumbnail && !thumbnail && (
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Current thumbnail:
              </p>
              <img 
                src={existingThumbnail} 
                alt="Current thumbnail"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting 
              ? (isEditMode ? 'Updating Event...' : 'Creating Event...') 
              : (isEditMode ? 'Update Event' : 'Create Event')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage; 