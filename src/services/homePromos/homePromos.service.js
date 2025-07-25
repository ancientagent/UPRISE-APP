import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function homePromosRequest(payload) {
  console.log('--- HOME PROMOS SERVICE: Starting API request ---');
  console.log('--- HOME PROMOS SERVICE: Config.HOME_PROMOS ---', Config.HOME_PROMOS);
  console.log('--- HOME PROMOS SERVICE: payload.state ---', payload.state);
  console.log('--- HOME PROMOS SERVICE: payload.accessToken ---', payload.accessToken ? 'Present' : 'Missing');
  
  // FIXED: Send station as query parameter instead of URL parameter
  // Backend expects: /home/promos?state=Austin
  // Not: /home/promos/Austin
  const baseUrl = '/home/promos';
  const finalUrl = `${baseUrl}?state=${encodeURIComponent(payload.state)}`;
  
  console.log('--- HOME PROMOS SERVICE: finalUrl ---', finalUrl);
  
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  
  console.log('--- HOME PROMOS SERVICE: requestOptions ---', requestOptions);
  console.log('--- HOME PROMOS SERVICE: Full URL ---', getRequestURL(finalUrl));
  
  return request(requestOptions)
    .then(response => {
      console.log('--- HOME PROMOS SERVICE: API response received ---', response);
      console.log('--- HOME PROMOS SERVICE: Response status ---', response?.status);
      console.log('--- HOME PROMOS SERVICE: Response data ---', response?.data);
      console.log('--- HOME PROMOS SERVICE: Response data length ---', response?.data?.length || 0);
      return response;
    })
    .catch(error => {
      console.log('--- HOME PROMOS SERVICE: API ERROR ---', error);
      console.log('--- HOME PROMOS SERVICE: Error message ---', error?.message);
      console.log('--- HOME PROMOS SERVICE: Error response ---', error?.response);
      console.log('--- HOME PROMOS SERVICE: Error status ---', error?.response?.status);
      throw error;
    });
}
