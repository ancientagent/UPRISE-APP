import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getBandsStatisticsRequest from '../../../services/getBandsStatistics/getBandsStatistics.service';
import { getBandsStatisticsSagaType } from '../../types/sagas';
import { getBandsStatisticsRequestActions } from '../../actions/request/getBandsStatistics/getBandsStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getBandsStatisticsWatcherSaga() {
  yield takeLatest(getBandsStatisticsSagaType, getBandsStatisticsWorkerSaga);
}

export function* getBandsStatisticsWorkerSaga() {
  yield put(getBandsStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getBandsStatisticsRequest, payload);
    if (response !== null) {
      yield put(getBandsStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getBandsStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
