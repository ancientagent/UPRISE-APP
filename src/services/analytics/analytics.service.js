import Config from 'react-native-config';
import {request} from '../request/request.service';
import {GET} from '../constants/Constants';
import {getRequestURL} from '../../utilities/utilities';

export default function analyticsRequest(payload) {
  console.log('--- ANALYTICS SERVICE: Starting API request ---');
  console.log(
    '--- ANALYTICS SERVICE: payload.accessToken ---',
    payload.accessToken ? 'Present' : 'Missing',
  );
  console.log('DEBUG: Config.MOST_PLAYED_SONGS =', Config.MOST_PLAYED_SONGS);

  // Replace the placeholder with actual count
  const url = Config.MOST_PLAYED_SONGS.replace('{COUNT}', '10'); // Default to 10 songs

  const requestOptions = {
    method: GET,
    url: getRequestURL(url), // FIXED: Use Config variable instead of hardcoded URL
    headers: {Authorization: `Bearer ${payload.accessToken}`},
  };

  console.log('--- ANALYTICS SERVICE: Full URL ---', getRequestURL(url));

  return request(requestOptions)
    .then(response => {
      console.log('--- ANALYTICS SERVICE: API response received ---', response);
      return response;
    })
    .catch(error => {
      console.log('--- ANALYTICS SERVICE: API ERROR ---', error);
      throw error;
    });
}
