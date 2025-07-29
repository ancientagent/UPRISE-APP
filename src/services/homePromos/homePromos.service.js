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
  
  // FIXED: Use Config variable instead of hardcoded URL
  // Replace the placeholder with actual state
  const url = Config.HOME_PROMOS.replace('{STATENAME}', payload.state);
  
  console.log('--- HOME PROMOS SERVICE: finalUrl ---', url);
  
  const requestOptions = {
    method: GET,
    url: getRequestURL(url), // FIXED: Use Config variable instead of hardcoded URL
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  
  console.log('--- HOME PROMOS SERVICE: requestOptions ---', requestOptions);
  console.log('--- HOME PROMOS SERVICE: Full URL ---', getRequestURL(url));
  
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
