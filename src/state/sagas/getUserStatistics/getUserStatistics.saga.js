import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getUserStatisticsRequest from '../../../services/getUserStatistics/getUserStatistics.service';
import { getUserStatisticsSagaType } from '../../types/sagas';
import { getUserStatisticsActions } from '../../actions/request/getUserStatistics/getUserStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getUserStatisticsWatcherSaga() {
  yield takeLatest(getUserStatisticsSagaType, getUserStatisticsWorkerSaga);
}

export function* getUserStatisticsWorkerSaga() {
  yield put(getUserStatisticsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getUserStatisticsRequest, payload);
    if (response !== null) {
      yield put(getUserStatisticsActions.succeed(response));
    }
  } catch (e) {
    yield put(getUserStatisticsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

