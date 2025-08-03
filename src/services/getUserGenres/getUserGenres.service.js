import Config from 'react-native-config';
import {request} from '../request/request.service';
import {GET} from '../constants/Constants';
import {getRequestURL} from '../../utilities/utilities';

export default function getUserGenresRequest(payload) {
  console.log('DEBUG: Config.GET_ALL_GENRES_URL =', Config.GET_ALL_GENRES_URL);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_ALL_GENRES_URL), // FIXED: Use Config variable instead of hardcoded URL
    headers: {
      Authorization: `Bearer ${payload.accessToken}`,
      'client-id': Config.CLIENT_ID,
      'client-secret': Config.CLIENT_SECRET,
    },
  };
  return request(requestOptions).then(response => response);
}
