import api from './api';

// This function will upload a song file and its title.
// It uses FormData to handle the file upload.
export const uploadSong = async (file: File, title: string, genres: string[], token: string, thumbnail?: File) => {
  console.log('=== UPLOAD SONG DEBUG START ===');
  console.log('File:', file);
  console.log('Title:', title);
  console.log('Genres:', genres);
  console.log('Token:', token ? 'Present' : 'Missing');
  console.log('Thumbnail:', thumbnail);
  
  // First, get the user's profile information which includes band data
  const userResponse = await api.get('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log('=== USER RESPONSE DEBUG ===');
  console.log('User response:', userResponse);
  
  const userData = userResponse.data.data;
  console.log('=== USER DATA DEBUG ===');
  console.log('User data:', userData);
  console.log('User band:', userData?.band);
  
  if (!userData || !userData.band || !userData.band.id) {
    console.log('=== ERROR: No band found ===');
    throw new Error('User does not have a band. Please create a band first.');
  }
  
  const bandData = userData.band;
  console.log('=== BAND DATA DEBUG ===');
  console.log('Band data:', bandData);

  const formData = new FormData();
  formData.append('song', file); // The audio file
  formData.append('title', title); // The song title
  formData.append('bandId', bandData.id.toString()); // Required by backend
  formData.append('userId', userData.id.toString()); // Required by backend
  
  // Add genres (required by backend)
  genres.forEach(genre => {
    formData.append('genres', genre);
  });
  
  // Add country (optional but good to include)
  formData.append('country', 'United States');
  
  // Add thumbnail if provided
  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }
  
  console.log('=== FORMDATA DEBUG ===');
  console.log('FormData entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    console.log('=== MAKING UPLOAD REQUEST ===');
    const response = await api.post('/song/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('=== UPLOAD SUCCESS ===');
    console.log('Response:', response);
    return response.data;
  } catch (error: any) {
    console.log('=== UPLOAD ERROR ===');
    console.log('Error:', error);
    console.log('Error response:', error.response);
    console.log('Error data:', error.response?.data);
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
export const replaceSong = async (songId: string, file: File, title: string, genres: string[], token: string, thumbnail?: File) => {
  // First, get the user's profile information which includes band data
  const userResponse = await api.get('/user/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const userData = userResponse.data.data;
  if (!userData || !userData.band || !userData.band.id) {
    throw new Error('User does not have a band. Please create a band first.');
  }
  
  const bandData = userData.band;

  const formData = new FormData();
  formData.append('song', file);
  formData.append('title', title);
  formData.append('bandId', bandData.id.toString()); // Required by backend
  formData.append('userId', userData.id.toString()); // Required by backend
  
  // Add genres (required by backend)
  genres.forEach(genre => {
    formData.append('genres', genre);
  });
  
  // Add country (optional but good to include)
  formData.append('country', 'United States');
  
  // Add thumbnail if provided
  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }

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