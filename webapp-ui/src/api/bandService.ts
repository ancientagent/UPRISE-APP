import api from './api';

// Function to create a new band (now uses ArtistProfile)
export const createBand = async (bandData: any, token: string) => {
  try {
    const response = await api.post('/user/create-artist-profile', bandData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Band creation error:', error);
    throw error.response?.data || error.message || 'Failed to create band';
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
    console.error('Get band details error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch band details';
    throw new Error(errorMessage);
  }
};

// Function to update artist profile information
export const updateArtistProfile = async (bandData: any, token: string) => {
  try {
    const response = await api.put('/user/artist-profile', bandData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Update artist profile error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to update artist profile';
    throw new Error(errorMessage);
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
    console.error('Get user band error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch user band';
    throw new Error(errorMessage);
  }
};

// Function to get the currently logged-in artist's band details
export const getMyBand = async (token: string) => {
  try {
    const response = await api.get('/user/band', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Get my band error:', error);
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch band data';
    throw new Error(errorMessage);
  }
}; 