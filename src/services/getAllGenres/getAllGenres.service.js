import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getAllGenresRequest(payload) {
  // The endpoint URL for getting genres
  // Use the comprehensive genres list from onboarding instead of basic auth genres
  const url = '/onboarding/all-genres'; // Use the correct comprehensive endpoint directly

  console.log('--- DEBUG: Using comprehensive genres endpoint ---', url);
  console.log(`--- DEBUG: Full URL will be: ${getRequestURL(url)} ---`);
  console.log(`--- DEBUG: Access token present: ${payload.accessToken ? 'YES' : 'NO'} ---`);

  const requestOptions = {
    method: GET,
    url: getRequestURL(url),
    headers: {
      Authorization: `Bearer ${payload.accessToken}`,
    },
  };
  
  return request(requestOptions)
    .then(response => {
      console.log(`--- DEBUG: Genres API response received ---`, response);
      return response;
    })
    .catch(error => {
      console.error(`--- DEBUG: Genres API error ---`, error);
      throw error;
    });
} 