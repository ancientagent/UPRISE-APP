import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import verifyUserNameRequest from '../../../services/signup/verifyUserName.service';
import { verifyUserNameType } from '../../types/sagas';
import { verifyUserNameRequestAction } from '../../actions/request/signup/verifyUserName.action';
import showAlert from '../AlertUtility';
import { ssoLoginSagaAction } from '../../actions/sagas';

export default function* verifyUserNameWatcherSaga() {
  yield takeLatest(verifyUserNameType, verifyUserNameWorkerSaga);
}

export function* verifyUserNameWorkerSaga(action) {
  yield put(verifyUserNameRequestAction.start());
  try {
    const payload = {
      ...action.payload,
    };
    const response = yield call(verifyUserNameRequest, payload);
    if (response !== null) {
      yield put(verifyUserNameRequestAction.succeed(response));
      yield call(showAlert, response.message);
      if (response.newUserName) {
        yield put(ssoLoginSagaAction(payload));
      }
    }
  } catch (e) {
    yield put(verifyUserNameRequestAction.fail(e));
    yield call(showAlert, e.error);
  }
}

