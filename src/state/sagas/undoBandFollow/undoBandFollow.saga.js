import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import undoBandFollowRequest from '../../../services/undoBandFollow/undoBandFollow.service';
import { undoBandFollowSagaType } from '../../types/sagas';
import { undoBandFollowRequestActions } from '../../actions/request/undoBandFollow/undoBandFollow.actions';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import {
  followingBandsSagaAction, getUserDetailsSagaAction, getRadioSongSagaAction,
} from '../../actions/sagas';

export default function* undoBandFollowWatcherSaga() {
  yield takeLatest(undoBandFollowSagaType, undoBandFollowWorkerSaga);
}

export function* undoBandFollowWorkerSaga(action) {
  yield put(undoBandFollowRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const userDetails = yield select(getUserDetails);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(undoBandFollowRequest, payload);
    if (response !== null) {
      yield put(undoBandFollowRequestActions.succeed(response));
      yield put(followingBandsSagaAction(userDetails.id));
      yield put(getUserDetailsSagaAction());
      yield put(getRadioSongSagaAction());
    }
  } catch (e) {
    yield put(undoBandFollowRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

