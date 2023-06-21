import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import songVoteRequest from '../../../services/songVote/songVote.service';
import { songVoteSagaType } from '../../types/sagas';
import { songVoteActions } from '../../actions/request/songVote/songVote.actions';
import { accessToken } from '../../selectors/UserProfile';
import showAlert from '../AlertUtility';
import { getRadioSongSagaAction } from '../../actions/sagas';

export default function* songVoteWatcherSaga() {
  yield takeLatest(songVoteSagaType, songVoteWorkerSaga);
}

export function* songVoteWorkerSaga(action) {
  yield put(songVoteActions.start());
  try {
    const userToken = yield select(accessToken);
    const payload = {
      ...action.payload,
      accessToken: userToken,
    };
    const response = yield call(songVoteRequest, payload);
    if (response !== null) {
      yield put(songVoteActions.succeed(response));
      yield put(getRadioSongSagaAction());
    }
  } catch (e) {
    yield put(songVoteActions.fail(e));
    yield call(showAlert, e.error);
  }
}

