import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import signUpRequest from '../../../services/signup/signup.service';
import { signupRequestActions } from '../../actions/request/signup/signup.actions';
import showAlert from '../AlertUtility';

export default function* signUpWatcherSaga() {
  yield takeLatest('SAGA/SIGNUPREQUEST', signUpWorkerSaga);
}

export function* signUpWorkerSaga(action) {
  yield put(signupRequestActions.start());
  try {
    const response = yield call(signUpRequest, action.payload);
    if (response !== null) {
      yield put(signupRequestActions.succeed(response));
      RootNavigation.navigate({ name: 'MailConfirmation', params: { showData: false } });
    }
  } catch (e) {
    yield put(signupRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

