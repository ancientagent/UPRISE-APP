import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import avaliableCitiesRequest from '../../../services/avaliableCities/avaliableCities.service';
import { avaliableCitiesSagaType } from '../../types/sagas';
import { avaliableCitiesActions } from '../../actions/request/avaliableCities/avaliableCities.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* avaliableCitiesWatcherSaga() {
  yield takeLatest(avaliableCitiesSagaType, avaliableCitiesWorkerSaga);
}

export function* avaliableCitiesWorkerSaga() {
  yield put(avaliableCitiesActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
    };
    const response = yield call(avaliableCitiesRequest, payload);
    if (response !== null) {
      yield put(avaliableCitiesActions.succeed(response));
    }
  } catch (e) {
    yield put(avaliableCitiesActions.fail(e));
    yield call(showAlert, e.error);
  }
}
