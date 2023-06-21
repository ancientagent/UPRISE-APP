import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';

export default function getSampleRequest(payload) {
  const requestOptions = {
    method: GET,
    url: Config.SAMPLEAPI,
  };
  const headers = {
  };
  return request(requestOptions, headers)
    .then(response => response);
}
