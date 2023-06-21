import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import followersListRequest from '../../../services/followersList/followersList.service';
import { followersListSagaType } from '../../types/sagas';
import { followersListActions } from '../../actions/request/followersList/followersList.actions';
import showAlert from '../AlertUtility';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';

export default function* followersListWatcherSaga() {
  yield takeLatest(followersListSagaType, followersListWorkerSaga);
}

export function* followersListWorkerSaga() {
  yield put(followersListActions.start());
  try {
    const userToken = yield select(accessToken);
    const user = yield select(getUserDetails);
    const payload = {
      accessToken: userToken,
      currentUserId: user.id,
    };
    const response = yield call(followersListRequest, payload);
    if (response !== null) {
      yield put(followersListActions.succeed(response));
    }
  } catch (e) {
    yield put(followersListActions.fail(e));
    yield call(showAlert, e.error);
  }
}

