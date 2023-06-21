import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function followRequest(payload) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.FOLLOW),
  };
  return request(requestOptions)
    .then(response => response);
}
