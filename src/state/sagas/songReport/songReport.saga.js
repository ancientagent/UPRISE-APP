import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songReportRequest from '../../../services/songReport/songReport.service';
import { songReportSagaType } from '../../types/sagas';
import { songReportActions } from '../../actions/request/songReport/songReport.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getRadioSongSagaAction } from '../../actions/sagas';

export default function* songReportWatcherSaga() {
  yield takeLatest(songReportSagaType, songReportWorkerSaga);
}

export function* songReportWorkerSaga(action) {
  yield put(songReportActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songReportRequest, payload);
    if (response !== null) {
      yield put(songReportActions.succeed(response));
      yield put(getRadioSongSagaAction());
    }
  } catch (e) {
    yield put(songReportActions.fail(e));
    yield call(showAlert, e.error);
  }
}

