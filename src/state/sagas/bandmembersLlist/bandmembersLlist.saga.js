import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandmembersLlistRequest from '../../../services/bandmembersLlist/bandmembersLlist.service';
import { bandmembersLlistSagaType } from '../../types/sagas';
import { bandmembersLlistActions } from '../../actions/request/bandmembersLlist/bandmembersLlist.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* bandmembersLlistWatcherSaga() {
  yield takeLatest(bandmembersLlistSagaType, bandmembersLlistWorkerSaga);
}

export function* bandmembersLlistWorkerSaga(action) {
  yield put(bandmembersLlistActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(bandmembersLlistRequest, payload);
    if (response !== null) {
      yield put(bandmembersLlistActions.succeed(response));
    }
  } catch (e) {
    yield put(bandmembersLlistActions.fail(e));
    yield call(showAlert, e.error);
  }
}

