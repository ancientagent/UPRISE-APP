import Config from 'react-native-config';
import {request} from '../request/request.service';
import {GET} from '../constants/Constants';
import {getRequestURL} from '../../utilities/utilities';

export default function homeEventsRequest(payload) {
  console.log('--- HOME EVENTS SERVICE: Starting API request ---');
  console.log(
    '--- HOME EVENTS SERVICE: Config.HOME_EVENTS ---',
    Config.HOME_EVENTS,
  );
  console.log('--- HOME EVENTS SERVICE: payload.state ---', payload.state);
  console.log(
    '--- HOME EVENTS SERVICE: payload.accessToken ---',
    payload.accessToken ? 'Present' : 'Missing',
  );

  // FIXED: Use Config variable instead of hardcoded URL
  // Replace the placeholder with actual state
  const url = Config.HOME_EVENTS.replace('{STATENAME}', payload.state);

  console.log('--- HOME EVENTS SERVICE: finalUrl ---', url);

  const requestOptions = {
    method: GET,
    url: getRequestURL(url), // FIXED: Use Config variable instead of hardcoded URL
    headers: {Authorization: `Bearer ${payload.accessToken}`},
  };

  console.log('--- HOME EVENTS SERVICE: requestOptions ---', requestOptions);
  console.log('--- HOME EVENTS SERVICE: Full URL ---', getRequestURL(url));

  return request(requestOptions)
    .then(response => {
      console.log(
        '--- HOME EVENTS SERVICE: API response received ---',
        response,
      );
      console.log(
        '--- HOME EVENTS SERVICE: Response status ---',
        response?.status,
      );
      console.log('--- HOME EVENTS SERVICE: Response data ---', response?.data);
      console.log(
        '--- HOME EVENTS SERVICE: Response data length ---',
        response?.data?.length || 0,
      );
      return response;
    })
    .catch(error => {
      console.log('--- HOME EVENTS SERVICE: API ERROR ---', error);
      console.log('--- HOME EVENTS SERVICE: Error message ---', error?.message);
      console.log(
        '--- HOME EVENTS SERVICE: Error response ---',
        error?.response,
      );
      console.log(
        '--- HOME EVENTS SERVICE: Error status ---',
        error?.response?.status,
      );
      throw error;
    });
}
