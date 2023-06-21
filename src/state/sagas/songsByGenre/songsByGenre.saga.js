import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songsByGenreRequest from '../../../services/songsByGenre/songsByGenre.service';
import { getSongsByGenreSagaType } from '../../types/sagas';
import { getSongsByGenreActions } from '../../actions/request/songsByGenre/songsByGenre.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* songsByGenreWatcherSaga() {
  yield takeLatest(getSongsByGenreSagaType, songsByGenreWorkerSaga);
}

export function* songsByGenreWorkerSaga(action) {
  yield put(getSongsByGenreActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      genreId: action.payload,
    };
    const response = yield call(songsByGenreRequest, payload);
    if (response !== null) {
      yield put(getSongsByGenreActions.succeed(response));
    }
  } catch (e) {
    yield put(getSongsByGenreActions.fail(e));
    yield call(showAlert, e.error);
  }
}

