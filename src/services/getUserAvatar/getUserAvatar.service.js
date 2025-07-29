import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getUserAvatarRequest(payload) {
  console.log('DEBUG: Config.GET_USER_AVATAR =', Config.GET_USER_AVATAR);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_USER_AVATAR),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
