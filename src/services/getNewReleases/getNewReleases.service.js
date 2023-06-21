import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getNewReleasesRequest(payload) {
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_NEW_RELEASES),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
