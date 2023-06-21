import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getRadioStationsSongsRequest(payload) {
  const finalUrl = Config.GET_RADIOSTATIONS_SONGS.replace('{STATENAME}', payload.state);
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
