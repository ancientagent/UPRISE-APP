import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getDayEventRequest from '../../../services/getDayEvent/getDayEvent.service';
import { getDayEventSagaType } from '../../types/sagas';
import { getDayEventActions } from '../../actions/request/getDayEvent/getDayEvent.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getDayEventWatcherSaga() {
  yield takeLatest(getDayEventSagaType, getDayEventWorkerSaga);
}

export function* getDayEventWorkerSaga(action) {
  yield put(getDayEventActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      day: action.payload,
    };
    const response = yield call(getDayEventRequest, payload);
    if (response !== null) {
      yield put(getDayEventActions.succeed(response));
    }
  } catch (e) {
    yield put(getDayEventActions.fail(e));
    yield call(showAlert, e.error);
  }
}

