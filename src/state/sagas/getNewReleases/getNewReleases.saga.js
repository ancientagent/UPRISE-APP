import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getNewReleasesRequest from '../../../services/getNewReleases/getNewReleases.service';
import { getNewReleasesSagaType } from '../../types/sagas';
import { getNewReleasesActions } from '../../actions/request/getNewReleases/getNewReleases.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getNewReleasesWatcherSaga() {
  yield takeLatest(getNewReleasesSagaType, getNewReleasesWorkerSaga);
}

export function* getNewReleasesWorkerSaga() {
  yield put(getNewReleasesActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getNewReleasesRequest, payload);
    if (response !== null) {
      yield put(getNewReleasesActions.succeed(response));
    }
  } catch (e) {
    yield put(getNewReleasesActions.fail(e));
    yield call(showAlert, e.error);
  }
}

