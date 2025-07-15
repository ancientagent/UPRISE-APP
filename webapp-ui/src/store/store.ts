import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bandReducer from './bandSlice';
import eventReducer from './eventSlice';
import analyticsReducer from './analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    band: bandReducer,
    events: eventReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 