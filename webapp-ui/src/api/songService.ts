import api from './api';

// This function will upload a song file and its title.
// It uses FormData to handle the file upload.
export const uploadSong = async (file: File, title: string, token: string) => {
  const formData = new FormData();
  formData.append('song', file); // The audio file
  formData.append('title', title); // The song title

  try {
    const response = await api.post('/song/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to delete a song
export const deleteSong = async (songId: string, token: string) => {
  try {
    const response = await api.delete(`/song/${songId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Function to replace a song. It's essentially the same as the upload,
// but it will target a specific song slot. We will add the slot logic later.
// For now, it will just call the 'edit' endpoint.
export const replaceSong = async (songId: string, file: File, title: string, token: string) => {
  const formData = new FormData();
  formData.append('song', file);
  formData.append('title', title);

  try {
    const response = await api.put(`/song/edit/${songId}`, formData, {
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