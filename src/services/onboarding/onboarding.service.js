import Config from 'react-native-config';
import {request} from '../request/request.service';
import {getRequestURL} from '../../utilities/utilities';
import * as HttpMethods from '../constants/Constants';

/**
 * Fetches the list of super genres from the backend.
 * @returns {Promise<any>}
 */
export const getSuperGenres = () => {
  console.log(
    'DEBUG: Config.ONBOARDING_SUPER_GENRES =',
    Config.ONBOARDING_SUPER_GENRES,
  );
  const url = getRequestURL(Config.ONBOARDING_SUPER_GENRES);
  return request(
    {
      method: HttpMethods.GET,
      url,
    },
    true,
  ); // `true` to omit auth as this is a public endpoint
};

/**
 * Validates the selected community (genre + location).
 * @param {object} data - The community data to validate.
 * @returns {Promise<any>}
 */
export const validateCommunity = data => {
  console.log(
    'DEBUG: Config.ONBOARDING_VALIDATE_COMMUNITY =',
    Config.ONBOARDING_VALIDATE_COMMUNITY,
  );
  const url = getRequestURL(Config.ONBOARDING_VALIDATE_COMMUNITY);
  return request(
    {
      method: HttpMethods.POST,
      url,
      data,
    },
    true,
  ); // `true` to omit auth
};

/**
 * Fetches city autocomplete suggestions.
 * @param {string} query - The search query for the city.
 * @returns {Promise<any>}
 */
export const getCitySuggestions = query => {
  console.log(
    'DEBUG: Config.COMMUNITIES_CITIES_AUTOCOMPLETE =',
    Config.COMMUNITIES_CITIES_AUTOCOMPLETE,
  );
  // Note: The spec has this under /communities, and the main router file in the backend
  // puts authentication on the /communities routes. For now, to match the backend
  // code I just wrote, I am putting it here and assuming it might need auth.
  // The spec does not require auth for this.
  // If auth is not needed, this should be moved or the backend routing changed.
  const url = getRequestURL(
    `${Config.COMMUNITIES_CITIES_AUTOCOMPLETE}?q=${query}`,
  );
  return request({
    method: HttpMethods.GET,
    url,
  }); // Auth is not omitted, as per backend route setup
};
