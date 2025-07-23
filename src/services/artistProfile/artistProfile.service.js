import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
  PUT,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

// Get user's artist profile
export default function getArtistProfileRequest(payload) {
  const requestOptions = {
    method: GET,
    url: getRequestURL('/user/me'),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}

// Update artist profile
export function updateArtistProfileRequest(payload) {
  const formData = new FormData();
  
  // Add form fields
  if (payload.title) formData.append('title', payload.title);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.facebook !== undefined) formData.append('facebook', payload.facebook);
  if (payload.instagram !== undefined) formData.append('instagram', payload.instagram);
  if (payload.youtube !== undefined) formData.append('youtube', payload.youtube);
  if (payload.twitter !== undefined) formData.append('twitter', payload.twitter);
  if (payload.promosEnabled !== undefined) formData.append('promosEnabled', payload.promosEnabled);
  
  // Add logo file if provided
  if (payload.logo) {
    formData.append('logo', {
      uri: payload.logo,
      type: 'image/jpeg',
      name: 'artist-logo.jpg',
    });
  }

  const requestOptions = {
    method: PUT,
    data: formData,
    headers: { 
      Authorization: `Bearer ${payload.accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
    url: getRequestURL('/user/artist-profile'),
  };
  return request(requestOptions)
    .then(response => response);
} 