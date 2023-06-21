import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import bandGalleryRequest from '../../../services/bandGallery/bandGallery.service';
import { bandGallerySagaType } from '../../types/sagas';
import { bandGalleryActions } from '../../actions/request/bandGallery/bandGallery.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* bandGalleryWatcherSaga() {
  yield takeLatest(bandGallerySagaType, bandGalleryWorkerSaga);
}

export function* bandGalleryWorkerSaga(action) {
  yield put(bandGalleryActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      accessToken: userToken,
      bandId: action.payload,
    };
    const response = yield call(bandGalleryRequest, payload);
    if (response !== null) {
      yield put(bandGalleryActions.succeed(response));
    }
  } catch (e) {
    yield put(bandGalleryActions.fail(e));
    yield call(showAlert, e.error);
  }
}

