import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandEventsRequest from '../../../services/bandEvents/bandEvents.service';
import { bandEventsSagaType } from '../../types/sagas';
import { bandEventsActions } from '../../actions/request/bandEvents/bandEvents.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* bandEventsWatcherSaga() {
  yield takeLatest(bandEventsSagaType, bandEventsWorkerSaga);
}

export function* bandEventsWorkerSaga(action) {
  yield put(bandEventsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(bandEventsRequest, payload);
    if (response !== null) {
      yield put(bandEventsActions.succeed(response));
    }
  } catch (e) {
    yield put(bandEventsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

