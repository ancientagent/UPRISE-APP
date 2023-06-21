import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songBlastRequest from '../../../services/songBlast/songBlast.service';
import { songBlastSagaType } from '../../types/sagas';
import { songBlastActions } from '../../actions/request/songBlast/songBlast.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getRadioSongSagaAction } from '../../actions/sagas';

export default function* songBlastWatcherSaga() {
  yield takeLatest(songBlastSagaType, songBlastWorkerSaga);
}

export function* songBlastWorkerSaga(action) {
  yield put(songBlastActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songBlastRequest, payload);
    if (response !== null) {
      yield put(songBlastActions.succeed(response));
      yield put(getRadioSongSagaAction());
    }
  } catch (e) {
    yield put(songBlastActions.fail(e));
    yield call(showAlert, e.error);
  }
}

