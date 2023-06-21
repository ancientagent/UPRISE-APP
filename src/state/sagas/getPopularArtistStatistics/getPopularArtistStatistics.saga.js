import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getPopularArtistStatisticsRequest from '../../../services/getPopularArtistStatistics/getPopularArtistStatistics.service';
import { getPopularArtistStatisticsSagaType } from '../../types/sagas';
import { getPopularArtistStatisticsRequestActions } from '../../actions/request/getPopularArtistStatistics/getPopularArtistStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getPopularArtistStatisticsWatcherSaga() {
  yield takeLatest(getPopularArtistStatisticsSagaType, getPopularArtistStatisticsWorkerSaga);
}

export function* getPopularArtistStatisticsWorkerSaga() {
  yield put(getPopularArtistStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getPopularArtistStatisticsRequest, payload);
    if (response !== null) {
      yield put(getPopularArtistStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getPopularArtistStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
