import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getUserGenresRequest from '../../../services/getUserGenres/getUserGenres.service';
import { getUserGenresSagaType } from '../../types/sagas';
import { getUserGenresActions } from '../../actions/request/getUserGenres/getUserGenres.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getUserGenresWatcherSaga() {
  yield takeLatest(getUserGenresSagaType, getUserGenresWorkerSaga);
}

export function* getUserGenresWorkerSaga() {
  yield put(getUserGenresActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getUserGenresRequest, payload);
    if (response !== null) {
      yield put(getUserGenresActions.succeed(response));
    }
  } catch (e) {
    yield put(getUserGenresActions.fail(e));
    yield call(showAlert, e.error);
  }
}

