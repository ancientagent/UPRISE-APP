import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET, POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function artistProfileRequest(payload) {
  console.log('DEBUG: Config.GET_USER_DETAILS_URL =', Config.GET_USER_DETAILS_URL);
  console.log('DEBUG: Config.ARTIST_PROFILE =', Config.ARTIST_PROFILE);
  
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_USER_DETAILS_URL), // FIXED: Use Config variable instead of hardcoded URL
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}

export function updateArtistProfileRequest(payload) {
  const requestOptions = {
    method: POST,
    url: getRequestURL(Config.ARTIST_PROFILE), // FIXED: Use Config variable instead of hardcoded URL
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    data: payload.data,
  };
  return request(requestOptions)
    .then(response => response);
} 