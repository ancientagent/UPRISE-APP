import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function mostPlayedSongsRequest(payload) {
  const finalUrl = Config.MOST_PLAYED_SONGS.replace('{STATENAME}', payload.state).replace('{COUNT}', payload.count);
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
