import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import albumsListRequest from '../../../services/albumsList/albumsList.service';
import { albumsListSagaType } from '../../types/sagas';
import { albumsListActions } from '../../actions/request/albumsList/albumsList.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* albumsListWatcherSaga() {
  yield takeLatest(albumsListSagaType, albumsListWorkerSaga);
}

export function* albumsListWorkerSaga(action) {
  yield put(albumsListActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(albumsListRequest, payload);
    if (response !== null) {
      yield put(albumsListActions.succeed(response));
    }
  } catch (e) {
    yield put(albumsListActions.fail(e));
    yield call(showAlert, e.error);
  }
}

