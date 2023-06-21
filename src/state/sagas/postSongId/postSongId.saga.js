import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import postSongIdRequest from '../../../services/postSongId/postSongId.service';
import { postSongIdSagaType } from '../../types/sagas';
import { postSongIdRequestActions } from '../../actions/request/postSongId/postSongId.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* postSongIdWatcherSaga() {
  yield takeLatest(postSongIdSagaType, postSongIdWorkerSaga);
}

export function* postSongIdWorkerSaga(action) {
  yield put(postSongIdRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(postSongIdRequest, payload);
    if (response !== null) {
      yield put(postSongIdRequestActions.succeed(response));
      yield call(action.payload.callback);
    }
  } catch (e) {
    yield put(postSongIdRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

