import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getGenresPrefrenceStatisticsRequest from '../../../services/getGenresPrefrenceStatistics/getGenresPrefrenceStatistics.service';
import { getGenresPrefrenceStatisticsSagaType } from '../../types/sagas';
import { getGenresPrefrenceStatisticsRequestActions } from '../../actions/request/getGenresPrefrenceStatistics/getGenresPrefrenceStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getGenresPrefrenceStatisticsWatcherSaga() {
  yield takeLatest(getGenresPrefrenceStatisticsSagaType, getGenresPrefrenceStatisticsWorkerSaga);
}

export function* getGenresPrefrenceStatisticsWorkerSaga() {
  yield put(getGenresPrefrenceStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getGenresPrefrenceStatisticsRequest, payload);
    if (response !== null) {
      yield put(getGenresPrefrenceStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getGenresPrefrenceStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
