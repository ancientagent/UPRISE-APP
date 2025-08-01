import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getInstrumentsRequest(payload) {
  console.log('DEBUG: Config.GET_INSTRUMENTS =', Config.GET_INSTRUMENTS);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_INSTRUMENTS),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
