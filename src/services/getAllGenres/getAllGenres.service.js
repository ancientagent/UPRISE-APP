import Config from 'react-native-config';
import {request} from '../request/request.service';
import {GET} from '../constants/Constants';
import {getRequestURL} from '../../utilities/utilities';

export default function getAllGenresRequest(payload) {
  console.log('DEBUG: Config.GET_ALL_GENRES_URL =', Config.GET_ALL_GENRES_URL);
  console.log(
    `--- DEBUG: Full URL will be: ${getRequestURL(
      Config.GET_ALL_GENRES_URL,
    )} ---`,
  );
  console.log(
    `--- DEBUG: Access token present: ${
      payload.accessToken ? 'YES' : 'NO'
    } ---`,
  );

  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_ALL_GENRES_URL), // FIXED: Use Config variable instead of hardcoded URL
    headers: {
      Authorization: `Bearer ${payload.accessToken}`,
      'client-id': Config.CLIENT_ID,
      'client-secret': Config.CLIENT_SECRET,
    },
  };

  return request(requestOptions)
    .then(response => {
      console.log('--- DEBUG: Genres API response received ---', response);
      return response;
    })
    .catch(error => {
      console.error('--- DEBUG: Genres API error ---', error);
      throw error;
    });
}
