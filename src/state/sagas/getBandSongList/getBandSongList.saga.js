import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandSongListRequest from '../../../services/getBandSongList/getBandSongList.service';
import { getBandSongListSagaType } from '../../types/sagas';
import { getBandSongListRequestActions } from '../../actions/request/getBandSongList/getBandSongList.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* bandSongListWatcherSaga() {
  yield takeLatest(getBandSongListSagaType, bandSongListWorkerSaga);
}

export function* bandSongListWorkerSaga(action) {
  yield put(getBandSongListRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(bandSongListRequest, payload);
    if (response !== null) {
      yield put(getBandSongListRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getBandSongListRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
