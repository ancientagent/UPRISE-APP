import api from './api';

export interface CreateEventData {
  title: string;
  description: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnail?: File;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export const createEvent = async (eventData: CreateEventData, token: string) => {
  const formData = new FormData();
  
  // Append text fields
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('venue', eventData.venue);
  formData.append('location', eventData.location);
  formData.append('startDate', eventData.startDate);
  formData.append('endDate', eventData.endDate);
  
  // Append file if provided
  if (eventData.thumbnail) {
    formData.append('thumbnail', eventData.thumbnail);
  }

  try {
    const response = await api.post('/eventmanagement/create-event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Create event error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create event';
    throw new Error(errorMessage);
  }
};

// Add this function to eventService.ts
export const getMyEvents = async (token: string) => {
  try {
    // First, get the user's band/artist profile
    const bandResponse = await api.get('/user/band', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const bandData = bandResponse.data;
    if (!bandData || !bandData.id) {
      // User doesn't have a band, return empty events
      return { data: [] };
    }
    
    // Now get events for this band
    const response = await api.get(`/eventmanagement/events-list?bandId=${bandData.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Get my events error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch events';
    throw new Error(errorMessage);
  }
};

// Add this function to get a single event by ID
export const getEventById = async (eventId: string, token: string) => {
  try {
    const response = await api.get(`/eventmanagement/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Get event by ID error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch event';
    throw new Error(errorMessage);
  }
};

// Add this function to update an event
export const updateEvent = async (eventId: string, eventData: CreateEventData, token: string) => {
  const formData = new FormData();
  
  // Append text fields
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('venue', eventData.venue);
  formData.append('location', eventData.location);
  formData.append('startDate', eventData.startDate);
  formData.append('endDate', eventData.endDate);
  
  // Append file if provided
  if (eventData.thumbnail) {
    formData.append('thumbnail', eventData.thumbnail);
  }

  try {
    const response = await api.put(`/eventmanagement/update-event/${eventId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Update event error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update event';
    throw new Error(errorMessage);
  }
};

// Add this function to delete an event
export const deleteEvent = async (eventId: string, token: string) => {
  try {
    const response = await api.delete(`/eventmanagement/event/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Delete event error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete event';
    throw new Error(errorMessage);
  }
}; 