import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyEvents, deleteEvent, type Event } from '../api/eventService';

interface EventState {
  events: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventState = {
  events: [],
  status: 'idle',
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (token: string) => {
    const response = await getMyEvents(token);
    return response;
  }
);

export const deleteEventAsync = createAsyncThunk(
  'events/deleteEvent',
  async ({ eventId, token }: { eventId: string; token: string }) => {
    await deleteEvent(eventId, token);
    return eventId;
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.events = [];
      state.status = 'idle';
      state.error = null;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle both array and object responses
        state.events = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(deleteEventAsync.fulfilled, (state, action) => {
        state.events = state.events.filter(event => event.id !== action.payload);
      });
  },
});

export const { clearEvents, addEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer; 