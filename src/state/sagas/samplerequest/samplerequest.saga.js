import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import { sampleReqSagaType } from '../../types/sagas';
import { sampleRequestActions } from '../../actions/request/samplerequest/samplerequest.actions';
import getSampleRequest from '../../../services/samplerequest/samplerequest.service';

export default function* sampleWatcherSaga() {
  yield takeLatest(sampleReqSagaType, sampleWorkerSaga);
}

export function* sampleWorkerSaga() {
  yield put(sampleRequestActions.start());
  try {
    const result = yield call(getSampleRequest);
    yield put(sampleRequestActions.succeed(result));
  } catch (error) {
    yield put(sampleRequestActions.fail(error));
  }
}

