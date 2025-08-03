import {call, put, takeLatest} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import signUpRequest from '../../../services/signup/signup.service';
import {signupRequestActions} from '../../actions/request/signup/signup.actions';
import showAlert from '../AlertUtility';

export default function* signUpWatcherSaga() {
  yield takeLatest('SAGA/SIGNUPREQUEST', signUpWorkerSaga);
}

export function* signUpWorkerSaga(action) {
  console.log('=== SIGNUP SAGA STARTED ===');
  console.log('Action payload:', action.payload);

  yield put(signupRequestActions.start());
  console.log('=== SIGNUP SAGA: Loading state set to true ===');

  try {
    console.log('=== SIGNUP SAGA: Calling signUpRequest ===');
    const response = yield call(signUpRequest, action.payload);
    console.log('=== SIGNUP SAGA: Response received ===', response);

    if (response !== null) {
      console.log('=== SIGNUP SAGA: Dispatching success ===');
      yield put(signupRequestActions.succeed(response));
      console.log('=== SIGNUP SAGA: Navigating to MailConfirmation ===');
      RootNavigation.navigate({
        name: 'MailConfirmation',
        params: {showData: false},
      });
    } else {
      console.log('=== SIGNUP SAGA: Response is null, dispatching fail ===');
      yield put(signupRequestActions.fail({error: 'Signup response was null'}));
      yield call(showAlert, 'Signup failed - no response from server');
    }
  } catch (e) {
    console.log('=== SIGNUP SAGA: Error caught ===', e);
    yield put(signupRequestActions.fail(e));
    yield call(showAlert, e.error || 'Signup failed - please try again');
  }
}
