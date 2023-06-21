import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import registerDeviceTokenRequest from '../../../services/registerDeviceToken/registerDeviceToken.service';
import { registerDeviceTokenSagaType } from '../../types/sagas';
import { registerDeviceTokenRequestActions } from '../../actions/request/registerDeviceToken/registerDeviceToken.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* registerDeviceTokenWatcherSaga() {
  yield takeLatest(registerDeviceTokenSagaType, registerDeviceTokenWorkerSaga);
}

export function* registerDeviceTokenWorkerSaga(action) {
  yield put(registerDeviceTokenRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(registerDeviceTokenRequest, payload);
    if (response !== null) {
      yield put(registerDeviceTokenRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(registerDeviceTokenRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

