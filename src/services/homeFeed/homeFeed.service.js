import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function homeFeedRequest(payload) {
  console.log('--- HOME FEED SERVICE: Starting API request ---');
  console.log('--- HOME FEED SERVICE: Config.HOME_FEED ---', Config.HOME_FEED);
  console.log('--- HOME FEED SERVICE: payload.accessToken ---', payload.accessToken ? 'Present' : 'Missing');
  
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.HOME_FEED),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  
  console.log('--- HOME FEED SERVICE: requestOptions ---', requestOptions);
  console.log('--- HOME FEED SERVICE: Full URL ---', getRequestURL(Config.HOME_FEED));
  
  return request(requestOptions)
    .then(response => {
      console.log('--- HOME FEED SERVICE: API response received ---', response);
      console.log('--- HOME FEED SERVICE: Response status ---', response?.status);
      console.log('--- HOME FEED SERVICE: Response data ---', response?.data);
      console.log('--- HOME FEED SERVICE: Response data length ---', response?.data?.length || 0);
      return response;
    })
    .catch(error => {
      console.log('--- HOME FEED SERVICE: API ERROR ---', error);
      console.log('--- HOME FEED SERVICE: Error message ---', error?.message);
      console.log('--- HOME FEED SERVICE: Error response ---', error?.response);
      console.log('--- HOME FEED SERVICE: Error status ---', error?.response?.status);
      throw error;
    });
}
