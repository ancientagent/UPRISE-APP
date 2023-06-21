import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import favoriteSongListRequest from '../../../services/favoriteSongList/favoriteSongList.service';
import { favoriteSongListSagaType } from '../../types/sagas';
import { favoriteSongListActions } from '../../actions/request/favoriteSongList/favoriteSongList.actions';
import showAlert from '../AlertUtility';
import { accessToken, getUserDetails } from '../../selectors/UserProfile';

export default function* favoriteSongListWatcherSaga() {
  yield takeLatest(favoriteSongListSagaType, favoriteSongListWorkerSaga);
}

export function* favoriteSongListWorkerSaga() {
  yield put(favoriteSongListActions.start());
  try {
    const userToken = yield select(accessToken);
    const userDetails = yield select(getUserDetails);
    const payload = {
      accessToken: userToken,
      id: userDetails.id,
    };
    const response = yield call(favoriteSongListRequest, payload);
    if (response !== null) {
      yield put(favoriteSongListActions.succeed(response));
    }
  } catch (e) {
    yield put(favoriteSongListActions.fail(e));
    yield call(showAlert, e.error);
  }
}
