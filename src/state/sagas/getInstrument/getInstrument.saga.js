import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getInstrumentsRequest from '../../../services/getInstrument/getInstrument.service';
import { getInstrumentSagaType } from '../../types/sagas';
import { getInstrumentRequestActions } from '../../actions/request/getInstrument/getInstrument.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getInstrumentWatcherSaga() {
  yield takeLatest(getInstrumentSagaType, getInstrumentWorkerSaga);
}

export function* getInstrumentWorkerSaga() {
  yield put(getInstrumentRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getInstrumentsRequest, payload);
    if (response !== null) {
      yield put(getInstrumentRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getInstrumentRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

