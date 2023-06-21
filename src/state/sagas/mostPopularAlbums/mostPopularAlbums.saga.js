import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import mostPopularAlbumsRequest from '../../../services/mostPopularAlbums/mostPopularAlbums.service';
import { mostPopularAlbumsSagaType } from '../../types/sagas';
import { mostPopularAlbumsActions } from '../../actions/request/mostPopularAlbums/mostPopularAlbums.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* mostPopularAlbumsWatcherSaga() {
  yield takeLatest(mostPopularAlbumsSagaType, mostPopularAlbumsWorkerSaga);
}

export function* mostPopularAlbumsWorkerSaga(action) {
  yield put(mostPopularAlbumsActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      count: action.payload.count,
    };
    const response = yield call(mostPopularAlbumsRequest, payload);
    if (response !== null) {
      yield put(mostPopularAlbumsActions.succeed(response));
    }
  } catch (e) {
    yield put(mostPopularAlbumsActions.fail(e));
    yield call(showAlert, e.error);
  }
}
