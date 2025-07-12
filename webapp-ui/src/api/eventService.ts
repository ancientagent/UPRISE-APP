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
    throw error.response?.data || error.message;
  }
};

// Add this function to eventService.ts
export const getMyEvents = async (token: string) => {
  try {
    const response = await api.get('/eventmanagement/events-list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
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
    throw error.response?.data || error.message;
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
    throw error.response?.data || error.message;
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
    throw error.response?.data || error.message;
  }
}; 