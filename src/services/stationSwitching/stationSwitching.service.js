import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  PUT,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function stationSwitchingRequest(payload) {
  const requestOptions = {
    method: PUT,
    data: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.STATION_SWITCHING),
  };
  return request(requestOptions)
    .then(response => response);
}
