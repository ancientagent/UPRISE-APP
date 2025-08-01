import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getRadioSongRequest(payload) {
  const finalUrl = Config.GET_RADIO_SONG.replace('{LOCATION}', payload.location);
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  console.log('[DIAGNOSTIC LOG] Full RaDIYo Player Request:', JSON.stringify(requestOptions, null, 2));
  return request(requestOptions)
    .then(response => response);
}
