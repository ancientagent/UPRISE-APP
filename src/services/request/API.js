import axios from 'axios';
import Config from 'react-native-config';
import * as RootNavigation from '../../navigators/RootNavigation';
import { getRequestURL } from '../../utilities/utilities';
import TokenService from '../../utilities/TokenService';
import applyAppTokenRefreshInterceptor from './refresh_token';

const axiosInstance = axios.create({
  timeout: 50000,
});

applyAppTokenRefreshInterceptor(axiosInstance, {
  setTokenData: async tokenData => {
    // console.log(tokenData);
    await TokenService.setAccessToken(tokenData.accessToken);
    await TokenService.setRefreshToken(tokenData.refreshToken);
  },
  shouldIntercept: error => {
    const originalRequest = error.config;
    const statusCode = error.response.status;
    if (statusCode === 401 && originalRequest.url === getRequestURL(Config.REFRESH_TOKEN_URL)) {
      console.log('Refresh token failed');
      RootNavigation.navigate({ name: 'Login' });
      return false;
    }
    return statusCode === 401;
  },
});

const customAxios = requestData => axiosInstance(requestData);

axiosInstance.interceptors.request.use(async config => {
  const accessToken = await TokenService.getAccessToken();
  // eslint-disable-next-line no-param-reassign
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  // console.log('set accessToken', accessToken);
  return config;
},
error => Promise.reject(error));

export default customAxios;

