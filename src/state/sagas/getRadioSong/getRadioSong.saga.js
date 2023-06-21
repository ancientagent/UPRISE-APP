import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import getRadioSongRequest from '../../../services/getRadioSong/getRadioSong.service';
import { getRadioSongSagaType } from '../../types/sagas';
import { getRadioSongActions } from '../../actions/request/getRadioSong/getRadioSong.actions';
import {
  accessToken, getUserDetails, getUserLocation, loginData, ssoLoginData,
} from '../../selectors/UserProfile';
import { nearestLocationsSagaAction } from '../../actions/sagas';

export default function* getRadioSongWatcherSaga() {
  yield takeLatest(getRadioSongSagaType, getRadioSongWorkerSaga);
}

export function* getRadioSongWorkerSaga() {
  yield put(getRadioSongActions.start());
  try {
    const userToken = yield select(accessToken);
    const selectedLocation = yield select(getUserDetails);
    const userLocation = yield select(getUserLocation);
    const LoginData = yield select(loginData);
    const ssoData = yield select(ssoLoginData);
    const location = 'radioPrefrence.location';
    const prefrence = 'user.radioPrefrence.location';
    const payload = {
      accessToken: userToken,
      location: _.get(ssoData, prefrence, '') || _.get(selectedLocation, location, '') || _.get(LoginData, prefrence, '') || userLocation.city,
    };
    const response = yield call(getRadioSongRequest, payload);
    if (response !== null) {
      yield put(getRadioSongActions.succeed(response));
    }
  } catch (e) {
    yield put(nearestLocationsSagaAction());
    yield put(getRadioSongActions.fail(e));
  }
}

