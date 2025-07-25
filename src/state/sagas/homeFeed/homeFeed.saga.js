import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import homeFeedRequest from '../../../services/homeFeed/homeFeed.service';
import { homeFeedSagaType } from '../../types/sagas';
import { homeFeedActions } from '../../actions/request/homeFeed/homeFeed.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';

export default function* homeFeedWatcherSaga() {
  console.log('--- HOME FEED SAGA: Watcher saga initialized ---');
  yield takeLatest(homeFeedSagaType, homeFeedWorkerSaga);
}

export function* homeFeedWorkerSaga() {
  console.log('--- HOME FEED SAGA: Starting homeFeedWorkerSaga ---');
  yield put(homeFeedActions.start());
  console.log('--- HOME FEED SAGA: Start action dispatched ---');
  
  try {
    const userToken = yield select(accessToken);
    console.log('--- HOME FEED SAGA: User token retrieved ---', userToken ? 'Present' : 'Missing');
    
    const payload = {
      accessToken: userToken,
    };
    console.log('--- HOME FEED SAGA: API payload prepared ---', payload);
    console.log('--- HOME FEED SAGA: Attempting to fetch home feed from API ---');
    
    const response = yield call(homeFeedRequest, payload);
    
    console.log('--- HOME FEED SAGA: API response received ---', response);
    console.log('--- HOME FEED SAGA: Response data ---', response?.data);
    console.log('--- HOME FEED SAGA: Response data length ---', response?.data?.length || 0);
    console.log('--- HOME FEED SAGA: Response type ---', typeof response);
    console.log('--- HOME FEED SAGA: Response is null ---', response === null);
    console.log('--- HOME FEED SAGA: Response is undefined ---', response === undefined);
    
    if (response !== null) {
      console.log('--- HOME FEED SAGA: Dispatching success action ---');
      yield put(homeFeedActions.succeed(response));
      console.log('--- HOME FEED SAGA: Success action dispatched ---');
    } else {
      console.log('--- HOME FEED SAGA: Response is null, not dispatching success ---');
    }
  } catch (e) {
    console.log('--- HOME FEED SAGA: ERROR occurred ---', e);
    console.log('--- HOME FEED SAGA: Error message ---', e.message);
    console.log('--- HOME FEED SAGA: Error response ---', e.response);
    console.log('--- HOME FEED SAGA: Error stack ---', e.stack);
    console.log('--- HOME FEED SAGA: Error name ---', e.name);
    yield put(homeFeedActions.fail(e));
    yield call(showAlert, e.error);
  }
}

