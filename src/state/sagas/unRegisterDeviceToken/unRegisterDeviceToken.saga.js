import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import unRegisterDeviceTokenRequest from '../../../services/unRegisterDeviceToken/unRegisterDeviceToken.service';
import { unRegisterDeviceTokenSagaType } from '../../types/sagas';
import { unRegisterDeviceTokenRequestActions } from '../../actions/request/unRegisterDeviceToken/unRegisterDeviceToken.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* unRegisterDeviceTokenWatcherSaga() {
  yield takeLatest(unRegisterDeviceTokenSagaType, unRegisterDeviceTokenWorkerSaga);
}

export function* unRegisterDeviceTokenWorkerSaga(action) {
  yield put(unRegisterDeviceTokenRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(unRegisterDeviceTokenRequest, payload);
    if (response !== null) {
      yield put(unRegisterDeviceTokenRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(unRegisterDeviceTokenRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

