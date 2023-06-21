import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import homePromosRequest from '../../../services/homePromos/homePromos.service';
import { homePromosSagaType } from '../../types/sagas';
import { homePromosActions } from '../../actions/request/homePromos/homePromos.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* homePromosWatcherSaga() {
  yield takeLatest(homePromosSagaType, homePromosWorkerSaga);
}

export function* homePromosWorkerSaga() {
  yield put(homePromosActions.start());
  try {
    const userToken = yield select(accessToken);
    const selectedLocation = yield select(getUserDetails);
    const userLocation = yield select(getUserLocation);
    const LoginData = yield select(loginData);
    const location = 'radioPrefrence.location';
    const prefrence = 'user.radioPrefrence.location';
    const payload = {
      accessToken: userToken,
      state: _.get(selectedLocation, location, '') || _.get(LoginData, prefrence, '') || userLocation.city,
    };
    const response = yield call(homePromosRequest, payload);
    if (response !== null) {
      yield put(homePromosActions.succeed(response));
    }
  } catch (e) {
    yield put(homePromosActions.fail(e));
    yield call(showAlert, e.error);
  }
}

