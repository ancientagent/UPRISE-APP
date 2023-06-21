import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import mostPopularGenresRequest from '../../../services/mostPopularGenres/mostPopularGenres.service';
import { mostPopularGenresSagaType } from '../../types/sagas';
import { mostPopularGenresActions } from '../../actions/request/mostPopularGenres/mostPopularGenres.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* mostPopularGenresWatcherSaga() {
  yield takeLatest(mostPopularGenresSagaType, mostPopularGenresWorkerSaga);
}

export function* mostPopularGenresWorkerSaga(action) {
  yield put(mostPopularGenresActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      count: action.payload.count,
    };
    const response = yield call(mostPopularGenresRequest, payload);
    if (response !== null) {
      yield put(mostPopularGenresActions.succeed(response));
    }
  } catch (e) {
    yield put(mostPopularGenresActions.fail(e));
    yield call(showAlert, e.error);
  }
}

