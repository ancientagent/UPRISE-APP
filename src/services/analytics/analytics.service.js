import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getSongAnalyticsRequest(payload) {
  console.log('--- ANALYTICS SERVICE: Starting analytics request ---');
  console.log('--- ANALYTICS SERVICE: payload ---', payload);
  
  const requestOptions = {
    method: GET,
    url: getRequestURL('/popular/most_played_songs'),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  
  console.log('--- ANALYTICS SERVICE: requestOptions ---', requestOptions);
  console.log('--- ANALYTICS SERVICE: Full URL ---', getRequestURL('/popular/most_played_songs'));
  
  return request(requestOptions)
    .then(response => {
      console.log('--- ANALYTICS SERVICE: Success response ---', response);
      return response;
    })
    .catch(error => {
      console.log('--- ANALYTICS SERVICE: Error ---', error);
      console.log('--- ANALYTICS SERVICE: Error message ---', error?.message);
      console.log('--- ANALYTICS SERVICE: Error response ---', error?.response);
      throw error;
    });
} 