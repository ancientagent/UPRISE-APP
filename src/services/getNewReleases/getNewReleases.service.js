import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getNewReleasesRequest(payload) {
  console.log('DEBUG: Config.HOME_NEW_RELEASES =', Config.HOME_NEW_RELEASES);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.HOME_NEW_RELEASES),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
