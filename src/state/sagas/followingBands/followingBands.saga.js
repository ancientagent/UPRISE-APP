import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import followingBandsRequest from '../../../services/followingBands/followingBands.service';
import { followingBandsSagaType } from '../../types/sagas';
import { followingBandsActions } from '../../actions/request/followingBands/followingBands.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* followingBandsWatcherSaga() {
  yield takeLatest(followingBandsSagaType, followingBandsWorkerSaga);
}

export function* followingBandsWorkerSaga(action) {
  yield put(followingBandsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      currentUserId: action.payload,
    };
    const response = yield call(followingBandsRequest, payload);
    if (response !== null) {
      yield put(followingBandsActions.succeed(response));
    }
  } catch (e) {
    yield put(followingBandsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

