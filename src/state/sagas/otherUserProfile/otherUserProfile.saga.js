import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import otherUserProfileRequest from '../../../services/otherUserProfile/otherUserProfile.service';
import { otherUserProfileSagaType } from '../../types/sagas';
import { otherUserProfileActions } from '../../actions/request/otherUserProfile/otherUserProfile.actions';
import showAlert from '../AlertUtility';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';

export default function* otherUserProfileWatcherSaga() {
  yield takeLatest(otherUserProfileSagaType, otherUserProfileWorkerSaga);
}

export function* otherUserProfileWorkerSaga(action) {
  yield put(otherUserProfileActions.start());
  try {
    const userToken = yield select(accessToken);
    const user = yield select(getUserDetails);
    const payload = {
      accessToken: userToken,
      currentUserId: user.id,
      otherUserId: action.payload,
    };
    const response = yield call(otherUserProfileRequest, payload);
    if (response !== null) {
      yield put(otherUserProfileActions.succeed(response));
    }
  } catch (e) {
    yield put(otherUserProfileActions.fail(e));
    yield call(showAlert, e.error);
  }
}

