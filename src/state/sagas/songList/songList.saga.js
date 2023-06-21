import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songListRequest from '../../../services/songList/songList.service';
import { songListSagaType } from '../../types/sagas';
import { songListActions } from '../../actions/request/songList/songList.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* songListWatcherSaga() {
  yield takeLatest(songListSagaType, songListWorkerSaga);
}

export function* songListWorkerSaga(action) {
  yield put(songListActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      albumId: action.payload.albumId,
      bandId: action.payload.bandId,
    };
    const response = yield call(songListRequest, payload);
    if (response !== null) {
      yield put(songListActions.succeed(response));
    }
  } catch (e) {
    yield put(songListActions.fail(e));
    yield call(showAlert, e.error);
  }
}

