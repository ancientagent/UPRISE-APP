import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import mostRatedSongsRequest from '../../../services/mostRatedSongs/mostRatedSongs.service';
import { mostRatedSongsSagaType } from '../../types/sagas';
import { mostRatedSongsActions } from '../../actions/request/mostRatedSongs/mostRatedSongs.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* mostRatedSongsWatcherSaga() {
  yield takeLatest(mostRatedSongsSagaType, mostRatedSongsWorkerSaga);
}

export function* mostRatedSongsWorkerSaga(action) {
  yield put(mostRatedSongsActions.start());
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
    const response = yield call(mostRatedSongsRequest, payload);
    if (response !== null) {
      yield put(mostRatedSongsActions.succeed(response));
    }
  } catch (e) {
    yield put(mostRatedSongsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

