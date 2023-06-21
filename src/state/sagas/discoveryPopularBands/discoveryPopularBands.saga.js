import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import discoveryPopularBandsRequest from '../../../services/discoveryPopularBands/discoveryPopularBands.service';
import { discoveryPopularBandsSagaType } from '../../types/sagas';
import { discoveryPopularBandsActions } from '../../actions/request/discoveryPopularBands/discoveryPopularBands.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* discoveryPopularBandsWatcherSaga() {
  yield takeLatest(discoveryPopularBandsSagaType, discoveryPopularBandsWorkerSaga);
}

export function* discoveryPopularBandsWorkerSaga(action) {
  yield put(discoveryPopularBandsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      count: action.payload.count,
    };
    const response = yield call(discoveryPopularBandsRequest, payload);
    if (response !== null) {
      yield put(discoveryPopularBandsActions.succeed(response));
    }
  } catch (e) {
    yield put(discoveryPopularBandsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

