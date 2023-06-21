import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function otherUserProfileRequest(payload) {
  const finalUrl = Config.OTHER_USER_PROFILE.replace('{CURRNETUSERID}', payload.currentUserId).replace('{OTHERUSERPROFILEID}', payload.otherUserId);
  const requestOptions = {
    method: GET,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
