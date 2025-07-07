import Config from 'react-native-config';
import TrackPlayer from 'react-native-track-player';
import * as RootNavigation from '../../navigators/RootNavigation';
import api from './apiSauce';
import NetworkUtils from '../../utilities/networkUtils';
import { reduxHelpers } from '../../state/store/reduxHelpers';
import { SIGN_OUT } from '../../state/types/ActionTypes';
import { networkError } from '../../state/actions/sagas/networkError/networkError.actions';

function setHeaders(headers, isFormData = false) {
  const header = {
    'Accept-Language': 'en-US',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    'client-id': Config.CLIENT_ID,
    'client-secret': Config.CLIENT_SECRET,
    ...headers,
  };
  
  // Only set Content-Type to application/json if it's not FormData
  if (!isFormData) {
    header['Content-Type'] = 'application/json';
  }
  
  return header;
}

export function combineHeaders(options, omitAuth, isFormData = false) {
  if (!omitAuth) {
    return setHeaders({ ...options }, isFormData);
  }
  return setHeaders(options, isFormData);
}

export function errorResponse(error, status) {
  // Should check error object here and do req changes checking different error objects
  const errorObject = {
    status,
    error,
  };
  console.log(`errorResponse ${JSON.stringify(errorObject)}`);
  if (errorObject.status === 403) {
    reduxHelpers.dispatch({ type: SIGN_OUT });
    TrackPlayer.stop();
    RootNavigation.navigate({ name: 'Login' });
  } else {
    throw errorObject;
  }
}

// eslint-disable-next-line consistent-return
export async function request(requestOptions, omitAuth) {
  const requestData = requestOptions;
  
  // Check if the data is FormData
  const isFormData = requestData.data instanceof FormData;
  
  requestData.headers = combineHeaders(requestOptions.headers, omitAuth, isFormData);
  const isNetworkConnected = await NetworkUtils.isNetworkAvailable();
  if (isNetworkConnected) {
    try {
      console.log('requestData', requestData);
      const res = await api(requestData);
      console.log('res', res);
      return res.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.error) {
          errorResponse(error.response.data.error, error.response.status);
        } else {
          errorResponse(error.response.data.message, error.response.status);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        errorResponse(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorResponse(error.error);
      }
    }
  } else {
    reduxHelpers.dispatch(networkError());
  }
}
