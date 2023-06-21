import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  DELETE,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function removeEventRequest(payload) {
  const requestOptions = {
    method: DELETE,
    data: JSON.stringify(payload),
    url: getRequestURL(Config.REMOVE_EVENT),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
