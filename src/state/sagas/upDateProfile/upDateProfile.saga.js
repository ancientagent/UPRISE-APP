import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import upDateProfileRequest from '../../../services/upDateProfile/upDateProfile.service';
import { upDateProfileSagaType } from '../../types/sagas';
import { upDateProfileRequestActions } from '../../actions/request/upDateProfile/upDateProfile.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getUserDetailsSagaAction } from '../../actions/sagas';

export default function* upDateProfileWatcherSaga() {
  yield takeLatest(upDateProfileSagaType, upDateProfileWorkerSaga);
}

export function* upDateProfileWorkerSaga(action) {
  yield put(upDateProfileRequestActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(upDateProfileRequest, action.payload, payload);
    if (response !== null) {
      yield put(upDateProfileRequestActions.succeed(response));
      yield put(getUserDetailsSagaAction());
    }
  } catch (e) {
    yield put(upDateProfileRequestActions.fail(e));
    yield call(showAlert, e.error);
  }
}

