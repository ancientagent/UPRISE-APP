import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getPopularArtistGenresStatisticsRequest from '../../../services/getPopularArtistGenresStatistics/getPopularArtistGenresStatistics.service';
import { getPopularArtistGenresStatisticsSagaType } from '../../types/sagas';
import { getPopularArtistGenresStatisticsRequestActions } from '../../actions/request/getPopularArtistGenresStatistics/getPopularArtistGenresStatistics.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getPopularArtistGenresStatisticsWatcherSaga() {
  yield takeLatest(getPopularArtistGenresStatisticsSagaType, getPopularArtistGenresStatisticsWorkerSaga);
}

export function* getPopularArtistGenresStatisticsWorkerSaga() {
  yield put(getPopularArtistGenresStatisticsRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getPopularArtistGenresStatisticsRequest, payload);
    if (response !== null) {
      yield put(getPopularArtistGenresStatisticsRequestActions.succeed(response));
    }
  } catch (e) {
    yield put(getPopularArtistGenresStatisticsRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}
