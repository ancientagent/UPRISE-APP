import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import homeEventsRequest from '../../../services/homeEvents/homeEvents.service';
import { homeEventsSagaType } from '../../types/sagas';
import { homeEventsActions } from '../../actions/request/homeEvents/homeEvents.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* homeEventsWatcherSaga() {
  yield takeLatest(homeEventsSagaType, homeEventsWorkerSaga);
}

export function* homeEventsWorkerSaga() {
  yield put(homeEventsActions.start());
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
    const response = yield call(homeEventsRequest, payload);
    if (response !== null) {
      yield put(homeEventsActions.succeed(response));
    }
  } catch (e) {
    yield put(homeEventsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

