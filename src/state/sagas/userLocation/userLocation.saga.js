import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import userLocationRequest from '../../../services/userLocation/userLocation.service';
import { userLocationSagaType } from '../../types/sagas';
import { userLocationRequestAction } from '../../actions/request/userLocation/userLocation.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* userLocationWatcherSaga() {
  yield takeLatest(userLocationSagaType, userLocationWorkerSaga);
}

export function* userLocationWorkerSaga(action) {
  yield put(userLocationRequestAction.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(userLocationRequest, payload);
    if (response !== null) {
      yield put(userLocationRequestAction.succeed(response));
      RootNavigation.navigate({ name: 'GenreSelection' });
    }
  } catch (e) {
    yield put(userLocationRequestAction.fail(e));
    yield call(showAlert, e.error);
  }
}

