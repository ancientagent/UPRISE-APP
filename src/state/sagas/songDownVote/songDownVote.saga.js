import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songDownVoteRequest from '../../../services/songDownVote/songDownVote.service';
import { songDownVoteSagaType } from '../../types/sagas';
import { songDownVoteActions } from '../../actions/request/songDownVote/songDownVote.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';

export default function* songDownVoteWatcherSaga() {
  yield takeLatest(songDownVoteSagaType, songDownVoteWorkerSaga);
}

export function* songDownVoteWorkerSaga(action) {
  yield put(songDownVoteActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songDownVoteRequest, payload);
    if (response !== null) {
      yield put(songDownVoteActions.succeed(response));
    }
  } catch (e) {
    yield put(songDownVoteActions.fail(e));
    yield call(showAlert, e.error);
  }
}

