import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import unFollowRequest from '../../../services/unFollow/unFollow.service';
import { unFollowSagaType } from '../../types/sagas';
import { unFollowRequestActions } from '../../actions/request/unFollow/unFollow.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import {
  followingSagaAction, getUserDetailsSagaAction, followersListSagaAction,
} from '../../actions/sagas';

export default function* unFollowWatcherSaga() {
  yield takeLatest(unFollowSagaType, unFollowWorkerSaga);
}

export function* unFollowWorkerSaga(action) {
  yield put(unFollowRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(unFollowRequest, payload);
    if (response !== null) {
      yield put(unFollowRequestActions.succeed(response));
      yield put(followingSagaAction());
      yield put(followersListSagaAction());
      yield put(getUserDetailsSagaAction());
    }
  } catch (e) {
    yield put(unFollowRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

