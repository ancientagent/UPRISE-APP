import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import homeFeedRequest from '../../../services/homeFeed/homeFeed.service';
import { homeFeedSagaType } from '../../types/sagas';
import { homeFeedActions } from '../../actions/request/homeFeed/homeFeed.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* homeFeedWatcherSaga() {
  yield takeLatest(homeFeedSagaType, homeFeedWorkerSaga);
}

export function* homeFeedWorkerSaga() {
  yield put(homeFeedActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(homeFeedRequest, payload);
    if (response !== null) {
      yield put(homeFeedActions.succeed(response));
    }
  } catch (e) {
    yield put(homeFeedActions.fail(e));
    yield call(showAlert, e.error);
  }
}

