import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import getRadioStationsSongsRequest from '../../../services/getRadioStationsSongs/getRadioStationsSongs.service';
import { getRadioStationsSongsSagaType } from '../../types/sagas';
import { getRadioStationsSongsActions } from '../../actions/request/getRadioStationsSongs/getRadioStationsSongs.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* getRadioStationsSongsWatcherSaga() {
  yield takeLatest(getRadioStationsSongsSagaType, getRadioStationsSongsWorkerSaga);
}

export function* getRadioStationsSongsWorkerSaga(action) {
  yield put(getRadioStationsSongsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      state: action.payload,
    };
    const response = yield call(getRadioStationsSongsRequest, payload);
    if (response !== null) {
      yield put(getRadioStationsSongsActions.succeed(response));
    }
  } catch (e) {
    yield put(getRadioStationsSongsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

