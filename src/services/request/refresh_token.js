import axios from 'axios';
import Config from 'react-native-config';
import TokenService from '../../utilities/TokenService';
import { getRequestURL } from '../../utilities/utilities';

const shouldIntercept = error => {
  try {
    return error.response.status === 401;
  } catch (e) {
    return false;
  }
};

const setTokenData = (tokenData = {}, axiosClient) => {
  // If necessary: save to storage
  //   tokenData's content includes data from handleTokenRefresh(): {
  //     idToken: data.auth_token,
  //     refreshToken: data.refresh_token,
  //     expiresAt: data.expires_in,
  // };
};

const handleTokenRefresh = async () => {
  const refreshToken = await TokenService.getRefreshToken();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = getRequestURL(Config.REFRESH_TOKEN_URL);
    const options = {
      headers: {
        'x-refresh-token': refreshToken,
        'Access-Control-Allow-Origin': '*',
        'client-id': Config.CLIENT_ID,
        'client-secret': Config.CLIENT_SECRET,
      },
    };
    const payloadData = { data: {} };
    axios.post(url, payloadData, options)
      .then(({ data }) => {
        const tokenData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        resolve(tokenData);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const attachTokenToRequest = (request, token) => {
  request.headers.Authorization = `Bearer ${token}`;
};

export default (axiosClient, customOptions = {}) => {
  let isRefreshing = false;
  let failedQueue = [];

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept,
    ...customOptions,
  };
  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = error => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest._queued = true;
        options.attachTokenToRequest(originalRequest, token);
        return axiosClient.request(originalRequest);
      }).catch(err => Promise.reject(error), // Ignore refresh token request's "err" and return actual "error" for the original request
      // eslint-disable-next-line function-paren-newline
      );
    }

    originalRequest._retry = true;
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh.call(options.handleTokenRefresh)
        .then(tokenData => {
          options.setTokenData(tokenData, axiosClient);
          options.attachTokenToRequest(originalRequest, tokenData.idToken);
          processQueue(null, tokenData.idToken);
          resolve(axiosClient.request(originalRequest));
        })
        .catch(err => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  };

  axiosClient.interceptors.response.use(undefined, interceptor);
};
