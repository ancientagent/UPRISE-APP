import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import verifyUserRequest from '../../../services/signup/verifyuser.service';
import { verifyUserType } from '../../types/sagas';
import { verifyUserRequestAction } from '../../actions/request/signup/verifyuser.actions';
import showAlert from '../AlertUtility';
import { ssoLoginSagaAction } from '../../actions/sagas';

export default function* verifyUserWatcherSaga() {
  yield takeLatest(verifyUserType, verifyUserWorkerSaga);
}

export function* verifyUserWorkerSaga(action) {
  yield put(verifyUserRequestAction.start());
  try {
    const payload = {
      ...action.payload,
    };
    const response = yield call(verifyUserRequest, payload);
    if (response !== null) {
      yield put(verifyUserRequestAction.succeed(response));
      if (response.newUser) {
        RootNavigation.navigate({ name: 'SignupUserName', params: { userInfo: payload.userInfo } });
      } else {
        const ssoLoginData = {
          email: payload.email,
          lastName: payload.userInfo.user.givenName,
          firstName: payload.userInfo.user.familyName,
          avatar: payload.userInfo.user.photo,
          role: response.user && response.user.role && response.user.role.name,
        };
        yield put(ssoLoginSagaAction(ssoLoginData));
      }
    }
  } catch (e) {
    yield put(verifyUserRequestAction.fail(e));
    yield call(showAlert, e.error);
  }
}

