import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import mostPopularBandsRequest from '../../../services/mostPopularBands/mostPopularBands.service';
import { mostPopularBandsSagaType } from '../../types/sagas';
import { mostPopularBandsActions } from '../../actions/request/mostPopularBands/mostPopularBands.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* mostPopularBandsWatcherSaga() {
  yield takeLatest(mostPopularBandsSagaType, mostPopularBandsWorkerSaga);
}

export function* mostPopularBandsWorkerSaga(action) {
  yield put(mostPopularBandsActions.start());
  try {
    const userToken = yield select(accessToken);
    const selectedLocation = yield select(getUserDetails);
    const userLocation = yield select(getUserLocation);
    const LoginData = yield select(loginData);
    const location = 'radioPrefrence.location';
    const prefrence = 'user.radioPrefrence.location';
    const payload = {
      accessToken: userToken,
      count: action.payload.count,
      state: _.get(selectedLocation, location, '') || _.get(LoginData, prefrence, '') || userLocation.state,
    };
    const response = yield call(mostPopularBandsRequest, payload);
    if (response !== null) {
      yield put(mostPopularBandsActions.succeed(response));
    }
  } catch (e) {
    yield put(mostPopularBandsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

