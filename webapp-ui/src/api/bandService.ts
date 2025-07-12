import api from './api';

// Function to create a new band
export const createBand = async (bandData: any, token: string) => {
  try {
    const response = await api.post('/band/create', bandData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to get band details
export const getBandDetails = async (bandId: string, token: string) => {
  try {
    const response = await api.get(`/band/${bandId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to update band information
export const updateBand = async (bandId: string, bandData: any, token: string) => {
  try {
    const response = await api.put(`/band/${bandId}`, bandData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to get user's band (if they have one)
export const getUserBand = async (token: string) => {
  try {
    const response = await api.get('/band/my-band', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to get the currently logged-in artist's band details
export const getMyBand = async (token: string) => {
  try {
    const response = await api.get('/band/band_details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}; 