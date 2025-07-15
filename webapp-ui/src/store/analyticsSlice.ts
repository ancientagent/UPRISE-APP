import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMySongAnalytics } from '../api/analyticsService';

export const fetchSongAnalytics = createAsyncThunk(
  'analytics/fetchSongAnalytics',
  async (token: string, { rejectWithValue }) => {
    try {
      return await getMySongAnalytics(token);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSongAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default analyticsSlice.reducer; 