import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import forgotPasswordRequest from '../../../services/forgotPassword/forgotPassword.service';
import { forgotPasswordReqSagaType } from '../../types/sagas';
import { forgotPasswordRequestActions } from '../../actions/request/forgotPassword/forgotPassword.actions';
import showAlert from '../AlertUtility';

export default function* forgotPasswordWatcherSaga() {
  yield takeLatest(forgotPasswordReqSagaType, forgotPasswordWorkerSaga);
}

export function* forgotPasswordWorkerSaga(action) {
  yield put(forgotPasswordRequestActions.start());
  try {
    const payload = {
      ...action.payload,
    };
    const response = yield call(forgotPasswordRequest, payload);
    if (response !== null) {
      yield put(forgotPasswordRequestActions.succeed(response));
      RootNavigation.navigate({ name: 'MailConfirmation', params: { showData: true } });
    }
  } catch (e) {
    yield put(forgotPasswordRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

