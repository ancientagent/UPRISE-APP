import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getGoogleEventRequest from '../../../services/getGoogleEvent/getGoogleEvent.service';
import { getGoogleEventSagaType } from '../../types/sagas';
import { getGoogleEventActions } from '../../actions/request/getGoogleEvent/getGoogleEvent.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getGoogleEventWatcherSaga() {
  yield takeLatest(getGoogleEventSagaType, getGoogleEventWorkerSaga);
}

export function* getGoogleEventWorkerSaga() {
  yield put(getGoogleEventActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getGoogleEventRequest, payload);
    if (response !== null) {
      yield put(getGoogleEventActions.succeed(response));
    }
  } catch (e) {
    yield put(getGoogleEventActions.fail(e));
    yield call(showAlert, e.error);
  }
}

