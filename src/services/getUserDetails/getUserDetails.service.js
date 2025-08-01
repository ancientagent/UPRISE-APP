import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getUserDetailsRequest(payload) {
  console.log('DEBUG: Config.GET_USER_DETAILS_URL =', Config.GET_USER_DETAILS_URL);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_USER_DETAILS_URL),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
