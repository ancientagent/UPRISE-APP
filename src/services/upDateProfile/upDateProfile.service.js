import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  PUT,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function upDateProfileRequest(formData, payload) {
  const requestOptions = {
    method: PUT,
    data: formData,
    headers: { Authorization: `Bearer ${payload.accessToken}` },
    url: getRequestURL(Config.UPDATED_PROFILE),
  };
  return request(requestOptions)
    .then(response => response);
}
