import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import followingRequest from '../../../services/following/following.service';
import { followingSagaType } from '../../types/sagas';
import { followingActions } from '../../actions/request/following/following.actions';
import showAlert from '../AlertUtility';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';

export default function* followingWatcherSaga() {
  yield takeLatest(followingSagaType, followingWorkerSaga);
}

export function* followingWorkerSaga() {
  yield put(followingActions.start());
  try {
    const userToken = yield select(accessToken);
    const user = yield select(getUserDetails);
    const payload = {
      accessToken: userToken,
      currentUserId: user.id,
    };
    const response = yield call(followingRequest, payload);
    if (response !== null) {
      yield put(followingActions.succeed(response));
    }
  } catch (e) {
    yield put(followingActions.fail(e));
    yield call(showAlert, e.error);
  }
}

