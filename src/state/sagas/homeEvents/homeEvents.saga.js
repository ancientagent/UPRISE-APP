import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import homeEventsRequest from '../../../services/homeEvents/homeEvents.service';
import { homeEventsSagaType } from '../../types/sagas';
import { homeEventsActions } from '../../actions/request/homeEvents/homeEvents.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* homeEventsWatcherSaga() {
  console.log('--- EVENTS SAGA: Watcher saga initialized ---');
  yield takeLatest(homeEventsSagaType, homeEventsWorkerSaga);
}

export function* homeEventsWorkerSaga() {
  console.log('--- EVENTS SAGA: Starting homeEventsWorkerSaga ---');
  yield put(homeEventsActions.start());
  console.log('--- EVENTS SAGA: Start action dispatched ---');
  
  try {
    const userToken = yield select(accessToken);
    const selectedLocation = yield select(getUserDetails);
    const userLocation = yield select(getUserLocation);
    const LoginData = yield select(loginData);
    
    console.log('--- EVENTS SAGA: User data retrieved ---');
    console.log('--- EVENTS SAGA: userToken ---', userToken ? 'Present' : 'Missing');
    console.log('--- EVENTS SAGA: selectedLocation ---', selectedLocation);
    console.log('--- EVENTS SAGA: userLocation ---', userLocation);
    console.log('--- EVENTS SAGA: LoginData ---', LoginData);
    
    const location = 'radioPrefrence.location';
    const prefrence = 'user.radioPrefrence.location';
    const locationFromSelected = _.get(selectedLocation, location, '');
    const locationFromLogin = _.get(LoginData, prefrence, '');
    const locationFromUser = userLocation.city;
    
    console.log('--- EVENTS SAGA: Location resolution ---');
    console.log('--- EVENTS SAGA: locationFromSelected ---', locationFromSelected);
    console.log('--- EVENTS SAGA: locationFromLogin ---', locationFromLogin);
    console.log('--- EVENTS SAGA: locationFromUser ---', locationFromUser);
    
    const payload = {
      accessToken: userToken,
      state: locationFromSelected || locationFromLogin || locationFromUser,
    };
    
    console.log('--- EVENTS SAGA: API payload prepared ---', payload);
    console.log('--- EVENTS SAGA: Final state value ---', payload.state);
    console.log('--- EVENTS SAGA: Attempting to fetch events from API ---');
    
    const response = yield call(homeEventsRequest, payload);
    
    console.log('--- EVENTS SAGA: API response received ---', response);
    console.log('--- EVENTS SAGA: Response data ---', response?.data);
    console.log('--- EVENTS SAGA: Response data length ---', response?.data?.length || 0);
    console.log('--- EVENTS SAGA: Response type ---', typeof response);
    console.log('--- EVENTS SAGA: Response is null ---', response === null);
    console.log('--- EVENTS SAGA: Response is undefined ---', response === undefined);
    
    if (response !== null) {
      console.log('--- EVENTS SAGA: Dispatching success action ---');
      yield put(homeEventsActions.succeed(response));
      console.log('--- EVENTS SAGA: Success action dispatched ---');
    } else {
      console.log('--- EVENTS SAGA: Response is null, not dispatching success ---');
    }
  } catch (e) {
    console.log('--- EVENTS SAGA: ERROR occurred ---', e);
    console.log('--- EVENTS SAGA: Error message ---', e.message);
    console.log('--- EVENTS SAGA: Error response ---', e.response);
    console.log('--- EVENTS SAGA: Error stack ---', e.stack);
    console.log('--- EVENTS SAGA: Error name ---', e.name);
    yield put(homeEventsActions.fail(e));
    yield call(showAlert, e.error);
  }
}

