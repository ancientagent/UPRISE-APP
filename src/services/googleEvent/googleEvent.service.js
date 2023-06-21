import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function googleEventRequest(payload) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify(payload),
    url: getRequestURL(Config.GOOGLE_EVENT),
  };
  return request(requestOptions)
    .then(response => response);
}
