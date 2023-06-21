import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import removeEventRequest from '../../../services/removeEvent/removeEvent.service';
import { removeEventSagaType } from '../../types/sagas';
import { removeEventActions } from '../../actions/request/removeEvent/removeEvent.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* removeEventWatcherSaga() {
  yield takeLatest(removeEventSagaType, removeEventWorkerSaga);
}

export function* removeEventWorkerSaga(action) {
  yield put(removeEventActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      eventId: action.payload,
    };
    const response = yield call(removeEventRequest, payload);
    if (response !== null) {
      yield put(removeEventActions.succeed(response));
    }
  } catch (e) {
    yield put(removeEventActions.fail(e));
    yield call(showAlert, e.error);
  }
}

