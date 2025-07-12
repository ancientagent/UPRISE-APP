import api from './api';

// Client credentials from environment variables with fallbacks
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '437920819fa89d19abe380073d28839c';
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || '28649120bdf32812f433f428b15ab1a1';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', 
      { email, password },
      { 
        headers: {
          'client-id': CLIENT_ID,
          'client-secret': CLIENT_SECRET,
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const signup = async (userData: SignupData) => {
  try {
    const response = await api.post('/auth/signup', 
      userData,
      { 
        headers: {
          'client-id': CLIENT_ID,
          'client-secret': CLIENT_SECRET,
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}; 