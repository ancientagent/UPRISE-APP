import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import followRequest from '../../../services/follow/follow.service';
import { followSagaType } from '../../types/sagas';
import { followRequestActions } from '../../actions/request/follow/follow.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import {
  getUserDetailsSagaAction,
} from '../../actions/sagas';

export default function* followWatcherSaga() {
  yield takeLatest(followSagaType, followWorkerSaga);
}

export function* followWorkerSaga(action) {
  yield put(followRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(followRequest, payload);
    if (response !== null) {
      yield put(followRequestActions.succeed(response));
      yield put(getUserDetailsSagaAction());
    }
  } catch (e) {
    yield put(followRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

