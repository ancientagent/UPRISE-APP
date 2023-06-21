import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songUnfavoriteRequest from '../../../services/songUnfavorite/songUnfavorite.service';
import { songUnfavoriteSagaType } from '../../types/sagas';
import { songUnfavoriteActions } from '../../actions/request/songUnfavorite/songUnfavorite.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getRadioSongSagaAction, favoriteSongListSagaAction, treandingSongsSagaAction } from '../../actions/sagas';

export default function* songUnfavoriteWatcherSaga() {
  yield takeLatest(songUnfavoriteSagaType, songUnfavoriteWorkerSaga);
}

export function* songUnfavoriteWorkerSaga(action) {
  yield put(songUnfavoriteActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songUnfavoriteRequest, payload);
    if (response !== null) {
      yield put(songUnfavoriteActions.succeed(response));
      yield put(getRadioSongSagaAction());
      yield put(favoriteSongListSagaAction());
      yield put(treandingSongsSagaAction({ count: 'all' }));
    }
  } catch (e) {
    yield put(songUnfavoriteActions.fail(e));
    yield call(showAlert, e.error);
  }
}

