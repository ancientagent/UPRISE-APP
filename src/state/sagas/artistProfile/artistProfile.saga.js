import {call, put, takeLatest, select} from 'redux-saga/effects';
import getArtistProfileRequest, {
  updateArtistProfileRequest,
} from '../../../services/artistProfile/artistProfile.service';
import {
  artistProfileSagaType,
  updateArtistProfileSagaType,
} from '../../types/sagas';
import {
  artistProfileActions,
  updateArtistProfileActions,
} from '../../actions/request/artistProfile/artistProfile.actions';
import {accessToken} from '../../selectors/UserProfile';

export default function* artistProfileWatcherSaga() {
  yield takeLatest(artistProfileSagaType, artistProfileWorkerSaga);
}

export function* artistProfileWorkerSaga(action) {
  try {
    yield put(artistProfileActions.start());
    const token = yield select(accessToken);
    const payload = {
      accessToken: token,
    };
    const response = yield call(getArtistProfileRequest, payload);
    yield put(artistProfileActions.succeed(response));
  } catch (e) {
    yield put(artistProfileActions.fail(e));
  }
}

export function* updateArtistProfileWatcherSaga() {
  yield takeLatest(updateArtistProfileSagaType, updateArtistProfileWorkerSaga);
}

export function* updateArtistProfileWorkerSaga(action) {
  try {
    yield put(updateArtistProfileActions.start());
    const token = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: token,
    };
    const response = yield call(updateArtistProfileRequest, payload);
    yield put(updateArtistProfileActions.succeed(response));
  } catch (e) {
    yield put(updateArtistProfileActions.fail(e));
  }
}
