import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bandReducer from './bandSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    band: bandReducer,
    events: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 