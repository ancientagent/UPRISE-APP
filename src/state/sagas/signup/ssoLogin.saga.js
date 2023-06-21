import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import AsyncStorage
from '@react-native-community/async-storage';
import * as RootNavigation from '../../../navigators/RootNavigation';
import ssoLoginRequest from '../../../services/signup/ssoLogin.service';
import { SSOLoginType } from '../../types/sagas';
import { ssoLoginRequestAction } from '../../actions/request/signup/ssoLogin.action';
import showAlert from '../AlertUtility';
import { getUserDetailsSagaAction, registerDeviceTokenSagaAction } from '../../actions/sagas';
import { userAuthAction } from '../../actions/userAuth/userAuth.action';
import TokenService from '../../../utilities/TokenService';

export default function* ssoLoginWatcherSaga() {
  yield takeLatest(SSOLoginType, ssoLoginWorkerSaga);
}

export function* ssoLoginWorkerSaga(action) {
  yield put(ssoLoginRequestAction.start());
  try {
    const payload = {
      user: {
        ...action.payload,
      },
    };
    const response = yield call(ssoLoginRequest, payload);
    if (response !== null) {
      const authDetails = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
      TokenService.setAccessToken(authDetails.accessToken);
      TokenService.setRefreshToken(authDetails.refreshToken);
      yield put(ssoLoginRequestAction.succeed(response));
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
    yield put(ssoLoginRequestAction.fail(e));
    yield call(showAlert, e.error);
  }
}

