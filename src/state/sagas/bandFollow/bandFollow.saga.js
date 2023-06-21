import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandFollowRequest from '../../../services/bandFollow/bandFollow.service';
import { bandFollowSagaType } from '../../types/sagas';
import { bandFollowRequestActions } from '../../actions/request/bandFollow/bandFollow.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import {
  getUserDetailsSagaAction, getRadioSongSagaAction
} from '../../actions/sagas';

export default function* bandFollowWatcherSaga() {
  yield takeLatest(bandFollowSagaType, bandFollowWorkerSaga);
}

export function* bandFollowWorkerSaga(action) {
  yield put(bandFollowRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(bandFollowRequest, payload);
    if (response !== null) {
      yield put(bandFollowRequestActions.succeed(response));
      yield put(getUserDetailsSagaAction());
      yield put(getRadioSongSagaAction());
    }
  } catch (e) {
    yield put(bandFollowRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

