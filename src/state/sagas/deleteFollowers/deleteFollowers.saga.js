import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import deleteFollowersRequest from '../../../services/deleteFollowers/deleteFollowers.service';
import { deleteFollowersSagaType } from '../../types/sagas';
import { deleteFollowersActions } from '../../actions/request/deleteFollowers/deleteFollowers.actions';
import showAlert from '../AlertUtility';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';
import {
  followersListSagaAction,
} from '../../actions/sagas';

export default function* deleteFollowersWatcherSaga() {
  yield takeLatest(deleteFollowersSagaType, deleteFollowersWorkerSaga);
}

export function* deleteFollowersWorkerSaga(action) {
  yield put(deleteFollowersActions.start());
  try {
    const userToken = yield select(accessToken);
    const user = yield select(getUserDetails);
    const payload = {
      accessToken: userToken,
      currentUserId: user.id,
      otherUserId: action.payload,
    };
    const response = yield call(deleteFollowersRequest, payload);
    if (response !== null) {
      yield put(deleteFollowersActions.succeed(response));
      yield put(followersListSagaAction());
    }
  } catch (e) {
    yield put(deleteFollowersActions.fail(e));
    yield call(showAlert, e.error);
  }
}

