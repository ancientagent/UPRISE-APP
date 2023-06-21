import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function bandFollowRequest(payload) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.BAND_FOLLOW),
  };
  return request(requestOptions)
    .then(response => response);
}
