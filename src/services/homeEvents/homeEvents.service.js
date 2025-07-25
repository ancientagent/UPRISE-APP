import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function homeEventsRequest(payload) {
  console.log('--- HOME EVENTS SERVICE: Starting API request ---');
  console.log('--- HOME EVENTS SERVICE: Config.HOME_EVENTS ---', Config.HOME_EVENTS);
  console.log('--- HOME EVENTS SERVICE: payload.state ---', payload.state);
  console.log('--- HOME EVENTS SERVICE: payload.accessToken ---', payload.accessToken ? 'Present' : 'Missing');
  
  // FIXED: Send station as query parameter instead of URL parameter
  // Backend expects: /home/feed/events?station=Austin
  // Not: /home/feed/events/Austin
  const baseUrl = '/home/feed/events';
  const finalUrl = `${baseUrl}?station=${encodeURIComponent(payload.state)}`;
  
  console.log('--- HOME EVENTS SERVICE: finalUrl ---', finalUrl);
  
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  
  console.log('--- HOME EVENTS SERVICE: requestOptions ---', requestOptions);
  console.log('--- HOME EVENTS SERVICE: Full URL ---', getRequestURL(finalUrl));
  
  return request(requestOptions)
    .then(response => {
      console.log('--- HOME EVENTS SERVICE: API response received ---', response);
      console.log('--- HOME EVENTS SERVICE: Response status ---', response?.status);
      console.log('--- HOME EVENTS SERVICE: Response data ---', response?.data);
      console.log('--- HOME EVENTS SERVICE: Response data length ---', response?.data?.length || 0);
      return response;
    })
    .catch(error => {
      console.log('--- HOME EVENTS SERVICE: API ERROR ---', error);
      console.log('--- HOME EVENTS SERVICE: Error message ---', error?.message);
      console.log('--- HOME EVENTS SERVICE: Error response ---', error?.response);
      console.log('--- HOME EVENTS SERVICE: Error status ---', error?.response?.status);
      throw error;
    });
}
