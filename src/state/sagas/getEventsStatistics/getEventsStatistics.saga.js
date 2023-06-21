import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getEventsStatisticsRequest from '../../../services/getEventsStatistics/getEventsStatistics.service';
import { getEventsStatisticsSagaType } from '../../types/sagas';
import { getEventsStatisticsRequestActions } from '../../actions/request/getEventsStatistics/getEventsStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getEventsStatisticsWatcherSaga() {
  yield takeLatest(getEventsStatisticsSagaType, getEventsStatisticsWorkerSaga);
}

export function* getEventsStatisticsWorkerSaga() {
  yield put(getEventsStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getEventsStatisticsRequest, payload);
    if (response !== null) {
      yield put(getEventsStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getEventsStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
