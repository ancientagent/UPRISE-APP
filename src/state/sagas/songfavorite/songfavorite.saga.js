import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songfavoriteRequest from '../../../services/songfavorite/songfavorite.service';
import { songfavoriteSagaType } from '../../types/sagas';
import { songfavoriteRequestActions } from '../../actions/request/songfavorite/songfavorite.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getRadioSongSagaAction, favoriteSongListSagaAction, treandingSongsSagaAction } from '../../actions/sagas';

export default function* songfavoriteWatcherSaga() {
  yield takeLatest(songfavoriteSagaType, songfavoriteWorkerSaga);
}

export function* songfavoriteWorkerSaga(action) {
  yield put(songfavoriteRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songfavoriteRequest, payload);
    if (response !== null) {
      yield put(songfavoriteRequestActions.succeed(response));
      yield put(getRadioSongSagaAction());
      yield put(favoriteSongListSagaAction());
      yield put(treandingSongsSagaAction({ count: 'all' }));
    }
  } catch (e) {
    yield put(songfavoriteRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

