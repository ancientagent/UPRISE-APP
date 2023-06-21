import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import nearestLocationsRequest from '../../../services/nearestLocations/nearestLocations.service';
import { nearestLocationsSagaType } from '../../types/sagas';
import { nearestLocationsActions } from '../../actions/request/nearestLocations/nearestLocations.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* nearestLocationsWatcherSaga() {
  yield takeLatest(nearestLocationsSagaType, nearestLocationsWorkerSaga);
}

export function* nearestLocationsWorkerSaga() {
  yield put(nearestLocationsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(nearestLocationsRequest, payload);
    if (response !== null) {
      yield put(nearestLocationsActions.succeed(response));
    }
  } catch (e) {
    yield put(nearestLocationsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

