import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getRadioStationsRequest from '../../../services/getRadioStations/getRadioStations.service';
import { getRadioStationsSagaType } from '../../types/sagas';
import { getRadioStationsActions } from '../../actions/request/getRadioStations/getRadioStations.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getRadioStationsWatcherSaga() {
  yield takeLatest(getRadioStationsSagaType, getRadioStationsWorkerSaga);
}

export function* getRadioStationsWorkerSaga() {
  yield put(getRadioStationsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(getRadioStationsRequest, payload);
    if (response !== null) {
      yield put(getRadioStationsActions.succeed(response));
    }
  } catch (e) {
    yield put(getRadioStationsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

