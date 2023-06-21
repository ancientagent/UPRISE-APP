import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import googleEventRequest from '../../../services/googleEvent/googleEvent.service';
import { googleEventSagaType } from '../../types/sagas';
import { googleEventActions } from '../../actions/request/googleEvent/googleEvent.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* googleEventWatcherSaga() {
  yield takeLatest(googleEventSagaType, googleEventWorkerSaga);
}

export function* googleEventWorkerSaga(action) {
  yield put(googleEventActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      eventId: action.payload,
    };
    const response = yield call(googleEventRequest, payload);
    if (response !== null) {
      yield put(googleEventActions.succeed(response));
    }
  } catch (e) {
    yield put(googleEventActions.fail(e));
    yield call(showAlert, e.error);
  }
}

