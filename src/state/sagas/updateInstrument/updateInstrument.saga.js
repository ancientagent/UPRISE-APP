import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import updateInstrumentRequest from '../../../services/updateInstrument/updateInstrument.service';
import { updateInstrumentSagaType } from '../../types/sagas';
import { updateInstrumentRequestActions } from '../../actions/request/updateInstrument/updateInstrument.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getUserDetailsSagaAction } from '../../actions/sagas';

export default function* updateInstrumentWatcherSaga() {
  yield takeLatest(updateInstrumentSagaType, updateInstrumentWorkerSaga);
}

export function* updateInstrumentWorkerSaga(action) {
  yield put(updateInstrumentRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(updateInstrumentRequest, action.payload, payload);
    if (response !== null) {
      yield put(updateInstrumentRequestActions.succeed(response));
      yield put(getUserDetailsSagaAction());
    }
  } catch (e) {
    yield put(updateInstrumentRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

