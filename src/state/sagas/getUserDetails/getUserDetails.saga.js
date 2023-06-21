import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getUserDetailsRequest from '../../../services/getUserDetails/getUserDetails.service';
import { getUserDetailsSagaType } from '../../types/sagas';
import { getUserDetailsActions } from '../../actions/request/getUserDetails/getUserDetails.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getUserDetailsWatcherSaga() {
  yield takeLatest(getUserDetailsSagaType, getUserDetailsWorkerSaga);
}

export function* getUserDetailsWorkerSaga() {
  yield put(getUserDetailsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getUserDetailsRequest, payload);
    if (response !== null) {
      yield put(getUserDetailsActions.succeed(response));
    }
  } catch (e) {
    yield put(getUserDetailsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

