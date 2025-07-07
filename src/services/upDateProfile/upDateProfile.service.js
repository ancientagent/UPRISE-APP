import Config from 'react-native-config';
import { request } from '../request/request.service';
import {
  POST,
} from '../constants/Constants';
import { getRequestURL } from '../../utilities/utilities';

export default async function upDateProfileRequest(formData) {
  const requestOptions = {
    method: POST,
    data: formData,
    url: getRequestURL(Config.UPDATE_PROFILE_URL),
  };
  return request(requestOptions)
    .then(response => response);
}

export async function updateOnboardingStatusRequest(onBoardingStatus) {
  const requestOptions = {
    method: POST,
    data: JSON.stringify({ onBoardingStatus }),
    url: getRequestURL(Config.UPDATE_ONBOARDING_STATUS_URL),
  };
  return request(requestOptions)
    .then(response => response);
}
