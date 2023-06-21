import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import albumDetailsRequest from '../../../services/albumDetails/albumDetails.service';
import { albumDetailsSagaType } from '../../types/sagas';
import { albumDetailsActions } from '../../actions/request/albumDetails/albumDetails.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* albumDetailsWatcherSaga() {
  yield takeLatest(albumDetailsSagaType, albumDetailsWorkerSaga);
}

export function* albumDetailsWorkerSaga(action) {
  yield put(albumDetailsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload.bandId,
      albumId: action.payload.albumId,
    };
    const response = yield call(albumDetailsRequest, payload);
    if (response !== null) {
      yield put(albumDetailsActions.succeed(response));
    }
  } catch (e) {
    yield put(albumDetailsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

