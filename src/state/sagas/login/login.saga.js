import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import AsyncStorage
from '@react-native-community/async-storage';
import * as RootNavigation from '../../../navigators/RootNavigation';
import loginRequest from '../../../services/login/login.service';
import { loginReqSagaType } from '../../types/sagas';
import { loginRequestActions } from '../../actions/request/login/login.actions';
import showAlert from '../AlertUtility';
import { getUserDetailsSagaAction, registerDeviceTokenSagaAction } from '../../actions/sagas';
import { userAuthAction } from '../../actions/userAuth/userAuth.action';
import TokenService from '../../../utilities/TokenService';

export default function* loginWatcherSaga() {
  yield takeLatest(loginReqSagaType, loginWorkerSaga);
}

export function* loginWorkerSaga(action) {
  yield put(loginRequestActions.start());
  try {
    const payload = {
      ...action.payload,
    };
    const response = yield call(loginRequest, payload);
    if (response !== null) {
      const authDetails = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
      yield put(loginRequestActions.succeed(response));
      yield TokenService.setAccessToken(authDetails.accessToken);
      yield TokenService.setRefreshToken(authDetails.refreshToken);
      yield put(userAuthAction(authDetails));
      if (yield AsyncStorage.getItem('fcmToken') !== null) {
        yield put(registerDeviceTokenSagaAction({
          token: yield AsyncStorage.getItem('fcmToken'),
        }));
      }
      yield put(getUserDetailsSagaAction());
      if (response.data.user.onBoardingStatus === 0) {
        RootNavigation.navigate({ name: 'UserLocation' });
      } else if (response.data.user.onBoardingStatus === 1) {
        RootNavigation.navigate({ name: 'GenreSelection' });
      } else if (response.data.user.onBoardingStatus === 2) {
        RootNavigation.navigate({ name: 'Dashboard' });
      } else if (response.data.user.onBoardingStatus === 3) {
        RootNavigation.navigate({ name: 'MailConfirmation', params: { showData: false } });
      }
    }
  } catch (e) {
    yield put(loginRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

