import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function genresSelectionRequest(payload) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.GENRES_SELECTION),
  };
  return request(requestOptions)
    .then(response => response);
}
