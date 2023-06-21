import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import changePasswordRequest from '../../../services/changePassword/changePassword.service';
import { changePasswordSagaType } from '../../types/sagas';
import { changePasswordActions } from '../../actions/request/changePassword/changePassword.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* changePasswordWatcherSaga() {
  yield takeLatest(changePasswordSagaType, changePasswordWorkerSaga);
}

export function* changePasswordWorkerSaga(action) {
  yield put(changePasswordActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(changePasswordRequest, payload);
    if (response !== null) {
      yield put(changePasswordActions.succeed(response));
      yield call(showAlert, 'Password changed successfully');
      RootNavigation.goBack();
    }
  } catch (e) {
    yield put(changePasswordActions.fail(e));
    yield call(showAlert, e.error);
  }
}

