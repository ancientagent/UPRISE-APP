import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  PUT,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function upDateCityRequest(payload) {
  const requestOptions = {
    method: PUT,
    data: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.UPDATE_CITY),
  };
  return request(requestOptions)
    .then(response => response);
}
