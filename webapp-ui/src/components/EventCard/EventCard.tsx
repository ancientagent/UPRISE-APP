import React from 'react';
import type { Event } from '../../api/eventService';

interface EventCardProps {
  event: Event;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#333',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {event.title}
          </h4>
          <p style={{ 
            margin: '0 0 8px 0', 
            color: '#666',
            fontSize: '14px'
          }}>
            📍 {event.venue}
          </p>
          {event.location && (
            <p style={{ 
              margin: '0 0 8px 0', 
              color: '#888',
              fontSize: '12px'
            }}>
              {event.location}
            </p>
          )}
          <p style={{ 
            margin: '0 0 12px 0', 
            color: '#007bff',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            📅 {formatDate(event.startDate)}
          </p>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {onEdit && (
              <button
                onClick={() => onEdit(event.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(event.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        {event.thumbnail && (
          <div style={{ marginLeft: '12px' }}>
            <img 
              src={event.thumbnail} 
              alt={event.title}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard; 