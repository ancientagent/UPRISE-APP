import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyBand } from '../api/bandService';
import { deleteSong, replaceSong } from '../api/songService';
import type { BandState, Song } from './types';

// Async thunk to fetch band data
export const fetchBandData = createAsyncThunk('band/fetchData', async (token: string) => {
  const response = await getMyBand(token);
  // Handle both old and new response structures
  return response.data || response;
});

// Async thunk to delete a song
export const deleteSongAsync = createAsyncThunk(
  'band/deleteSong',
  async ({ songId, token }: { songId: string; token: string }) => {
    const response = await deleteSong(songId, token);
    return { songId, response };
  }
);

// Async thunk to replace a song
export const replaceSongAsync = createAsyncThunk(
  'band/replaceSong',
  async ({ songId, file, title, token }: { songId: string; file: File; title: string; token: string }) => {
    const response = await replaceSong(songId, file, title, token);
    return { songId, response };
  }
);

const initialState: BandState = {
  data: null,
  status: 'idle',
  error: null,
};

const bandSlice = createSlice({
  name: 'band',
  initialState,
  reducers: {
    songDeleted(state, action) {
      const { songId } = action.payload;
      if (state.data && state.data.songs) {
        state.data.songs = state.data.songs.filter((song: Song) => song.id !== songId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBandData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBandData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchBandData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch band data';
      })
      .addCase(deleteSongAsync.fulfilled, (state, action) => {
        // Song is already deleted from backend, remove from local state
        const { songId } = action.payload;
        if (state.data && state.data.songs) {
          state.data.songs = state.data.songs.filter((song: Song) => song.id !== songId);
        }
      })
      .addCase(replaceSongAsync.fulfilled, () => {
        // Refresh band data to get updated song information
        // This will be handled by the component calling fetchBandData
      });
  },
});

export const { songDeleted } = bandSlice.actions;
export default bandSlice.reducer; 