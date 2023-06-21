import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getUserAvatarRequest from '../../../services/getUserAvatar/getUserAvatar.service';
import { getUserAvatarSagaType } from '../../types/sagas';
import { getUserAvatarActions } from '../../actions/request/getUserAvatar/getUserAvatar.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getUserAvatarWatcherSaga() {
  yield takeLatest(getUserAvatarSagaType, getUserAvatarWorkerSaga);
}

export function* getUserAvatarWorkerSaga() {
  yield put(getUserAvatarActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getUserAvatarRequest, payload);
    if (response !== null) {
      yield put(getUserAvatarActions.succeed(response));
    }
  } catch (e) {
    yield put(getUserAvatarActions.fail(e));
    yield call(showAlert, e.error);
  }
}

