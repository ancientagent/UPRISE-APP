import api from './api';

export const getMySongAnalytics = async (token: string) => {
  try {
    const response = await api.get('/popular/most_played_songs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}; 