import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import mostPlayedSongsRequest from '../../../services/mostPlayedSongs/mostPlayedSongs.service';
import { mostPlayedSongsSagaType } from '../../types/sagas';
import { mostPlayedSongsActions } from '../../actions/request/mostPlayedSongs/mostPlayedSongs.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* mostPlayedSongsWatcherSaga() {
  yield takeLatest(mostPlayedSongsSagaType, mostPlayedSongsWorkerSaga);
}

export function* mostPlayedSongsWorkerSaga(action) {
  yield put(mostPlayedSongsActions.start());
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
    const response = yield call(mostPlayedSongsRequest, payload);
    if (response !== null) {
      yield put(mostPlayedSongsActions.succeed(response));
    }
  } catch (e) {
    yield put(mostPlayedSongsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

