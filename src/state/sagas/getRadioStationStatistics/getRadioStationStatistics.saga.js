import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getRadioStationStatisticsRequest from '../../../services/getRadioStationStatistics/getRadioStationStatistics.service';
import { getRadioStationStatisticsSagaType } from '../../types/sagas';
import { getRadioStationStatisticsRequestActions } from '../../actions/request/getRadioStationStatistics/getRadioStationStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getRadioStationStatisticsWatcherSaga() {
  yield takeLatest(getRadioStationStatisticsSagaType, getRadioStationStatisticsWorkerSaga);
}

export function* getRadioStationStatisticsWorkerSaga() {
  yield put(getRadioStationStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getRadioStationStatisticsRequest, payload);
    if (response !== null) {
      yield put(getRadioStationStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getRadioStationStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
