
import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  GET,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default function getPopularArtistGenresStatisticsRequest(payload) {
  const requestOptions = {
    method: GET,
    url: getRequestURL(Config.GET_POPULAR_ARTIST_GENRES_STATISTICS),
    headers: { Authorization: `Bearer ${payload.accessToken}` },
  };
  return request(requestOptions)
    .then(response => response);
}
