import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default async function signUpRequest(formData) {
  const requestOptions = {
    method: POST,
    data: formData,
    url: getRequestURL(Config.SIGNUP_URL),
  };
  return request(requestOptions)
    .then(response => response);
}
