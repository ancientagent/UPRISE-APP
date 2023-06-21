import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  DELETE,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function deleteFollowersRequest(payload) {
  const finalUrl = Config.DELETE_FOLLOWERS.replace('{CURRNETUSERID}', payload.currentUserId).replace('{FOLLOWERID}', payload.otherUserId);
  const requestOptions = {
    method: DELETE,
    url: getRequestURL(finalUrl),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
