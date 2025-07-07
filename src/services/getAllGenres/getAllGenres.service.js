import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getAllGenresRequest(payload) {
  // The endpoint URL for getting genres
  const url = Config.GET_ALL_GENRES_URL;

  console.log(`--- DEBUG: Attempting to GET genres from ${url} ---`);

  const requestOptions = {
    method: GET,
    url: getRequestURL(url),
    headers: {
      Authorization: `Bearer ${payload.accessToken}`,
    },
  };
  
  return request(requestOptions)
    .then(response => response);
} 