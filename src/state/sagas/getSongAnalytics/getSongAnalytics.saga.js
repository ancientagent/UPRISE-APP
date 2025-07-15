import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getSongAnalyticsRequest from '../../../services/analytics/analytics.service';
import { getSongAnalyticsSagaType } from '../../types/sagas';
import { getSongAnalyticsActions } from '../../actions/request/getSongAnalytics/getSongAnalytics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getSongAnalyticsWatcherSaga() {
  yield takeLatest(getSongAnalyticsSagaType, getSongAnalyticsWorkerSaga);
}

export function* getSongAnalyticsWorkerSaga() {
  yield put(getSongAnalyticsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getSongAnalyticsRequest, payload);
    if (response !== null) {
      yield put(getSongAnalyticsActions.succeed(response));
    }
  } catch (e) {
    yield put(getSongAnalyticsActions.fail(e));
    yield call(showAlert, e.error);
  }
} 