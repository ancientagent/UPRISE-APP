import Config from 'react-native-config';
import {request} from '../request/request.service';
import {GET} from '../constants/Constants';
import {getRequestURL} from '../../utilities/utilities';

export default function avaliableCitiesRequest(payload) {
  console.log('DEBUG: Config.AVAILABLE_CITIES =', Config.AVAILABLE_CITIES);
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.AVAILABLE_CITIES), // FIXED: Corrected variable name from AVALIABLE_CITIES to AVAILABLE_CITIES
    headers: {Authorization: `Bearer ${payload.accessToken}`},
  };
  return request(requestOptions).then(response => response);
}
