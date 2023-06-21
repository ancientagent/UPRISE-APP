import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import treandingSongsRequest from '../../../services/treandingSongs/treandingSongs.service';
import { treandingSongsSagaType } from '../../types/sagas';
import { treandingSongsActions } from '../../actions/request/treandingSongs/treandingSongs.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* treandingSongsWatcherSaga() {
  yield takeLatest(treandingSongsSagaType, treandingSongsWorkerSaga);
}

export function* treandingSongsWorkerSaga(action) {
  yield put(treandingSongsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      count: action.payload.count,
    };
    const response = yield call(treandingSongsRequest, payload);
    if (response !== null) {
      yield put(treandingSongsActions.succeed(response));
    }
  } catch (e) {
    yield put(treandingSongsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

