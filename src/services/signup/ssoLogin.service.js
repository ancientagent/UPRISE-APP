import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function ssoLoginRequest(payload) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify(payload),
    url: getRequestURL(Config.SSOLOGIN),
  };
  return request(requestOptions)
    .then(response => response);
}
