import {call, put, takeLatest, select, take, race} from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import * as RootNavigation from '../../../navigators/RootNavigation';
import loginRequest from '../../../services/login/login.service';
import {loginReqSagaType} from '../../types/sagas';
import {loginRequestActions} from '../../actions/request/login/login.actions';
import {getUserDetailsActions} from '../../actions/request/getUserDetails/getUserDetails.actions';
import showAlert from '../AlertUtility';
import {
  getUserDetailsSagaAction,
  registerDeviceTokenSagaAction,
} from '../../actions/sagas';
import {userAuthAction} from '../../actions/userAuth/userAuth.action';
import TokenService from '../../../utilities/TokenService';
import {getUserDetails} from '../../selectors/UserProfile';

export default function* loginWatcherSaga() {
  yield takeLatest(loginReqSagaType, loginWorkerSaga);
}

export function* loginWorkerSaga(action) {
  console.log('--- LOGIN SAGA: STARTING LOGIN PROCESS ---', {
    timestamp: new Date().toISOString(),
    payload: action.payload,
  });

  yield put(loginRequestActions.start());

  try {
    const payload = {
      ...action.payload,
    };
    const response = yield call(loginRequest, payload);

    // CORRECTED: Check for the user object at the correct path: response.data.user
    if (response && response.data && response.data.user) {
      const user = response.data.user;
      console.log(
        '--- LOGIN SAGA: User profile direct from API ---',
        JSON.stringify(user, null, 2),
      );

      // Save user details and token to the Redux store
      yield put(loginRequestActions.succeed(response.data));
      yield call(TokenService.setAccessToken, response.data.accessToken);
      yield call(TokenService.setRefreshToken, response.data.refreshToken);
      yield put(
        userAuthAction({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }),
      );

      // Register device token if available
      if (yield AsyncStorage.getItem('fcmToken') !== null) {
        yield put(
          registerDeviceTokenSagaAction({
            token: yield AsyncStorage.getItem('fcmToken'),
          }),
        );
      }

      // Dispatch action to save user details to Redux store
      // The authNavigation saga will handle navigation after getUserDetails succeeds
      yield put(getUserDetailsSagaAction());

      console.log(
        '--- LOGIN SAGA: Login process complete. Navigation will be handled by authNavigation saga. ---',
      );
    } else {
      // Handle the case where the user object is missing
      console.error(
        '--- LOGIN SAGA: ERROR - User data object not found in login response. ---',
        response?.data,
      );
      yield put(
        loginRequestActions.fail('Login failed: Invalid response from server.'),
      );
    }
  } catch (error) {
    console.error('--- LOGIN SAGA: CATCH BLOCK ERROR ---', error);
    yield put(loginRequestActions.fail(error));
    yield call(showAlert, error.error || 'Login failed. Please try again.');
  }
}
