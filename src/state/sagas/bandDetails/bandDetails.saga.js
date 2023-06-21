import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandDetailsRequest from '../../../services/bandDetails/bandDetails.service';
import { bandDetailsSagaType } from '../../types/sagas';
import { bandDetailsActions } from '../../actions/request/bandDetails/bandDetails.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* bandDetailsWatcherSaga() {
  yield takeLatest(bandDetailsSagaType, bandDetailsWorkerSaga);
}

export function* bandDetailsWorkerSaga(action) {
  yield put(bandDetailsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(bandDetailsRequest, payload);
    if (response !== null) {
      yield put(bandDetailsActions.succeed(response));
    }
  } catch (e) {
    yield put(bandDetailsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

