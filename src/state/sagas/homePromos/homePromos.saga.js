import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import _ from 'lodash';
import homePromosRequest from '../../../services/homePromos/homePromos.service';
import { homePromosSagaType } from '../../types/sagas';
import { homePromosActions } from '../../actions/request/homePromos/homePromos.actions';
import showAlert from '../AlertUtility';
import {
  accessToken, getUserDetails, getUserLocation, loginData,
} from '../../selectors/UserProfile';

export default function* homePromosWatcherSaga() {
  console.log('--- PROMOS SAGA: Watcher saga initialized ---');
  yield takeLatest(homePromosSagaType, homePromosWorkerSaga);
}

export function* homePromosWorkerSaga() {
  console.log('--- PROMOS SAGA: Starting homePromosWorkerSaga ---');
  yield put(homePromosActions.start());
  console.log('--- PROMOS SAGA: Start action dispatched ---');
  
  try {
    const userToken = yield select(accessToken);
    const selectedLocation = yield select(getUserDetails);
    const userLocation = yield select(getUserLocation);
    const LoginData = yield select(loginData);
    
    console.log('--- PROMOS SAGA: User data retrieved ---');
    console.log('--- PROMOS SAGA: userToken ---', userToken ? 'Present' : 'Missing');
    console.log('--- PROMOS SAGA: selectedLocation ---', selectedLocation);
    console.log('--- PROMOS SAGA: userLocation ---', userLocation);
    console.log('--- PROMOS SAGA: LoginData ---', LoginData);
    
    const location = 'radioPrefrence.location';
    const prefrence = 'user.radioPrefrence.location';
    const locationFromSelected = _.get(selectedLocation, location, '');
    const locationFromLogin = _.get(LoginData, prefrence, '');
    const locationFromUser = userLocation.city;
    
    console.log('--- PROMOS SAGA: Location resolution ---');
    console.log('--- PROMOS SAGA: locationFromSelected ---', locationFromSelected);
    console.log('--- PROMOS SAGA: locationFromLogin ---', locationFromLogin);
    console.log('--- PROMOS SAGA: locationFromUser ---', locationFromUser);
    
    const payload = {
      accessToken: userToken,
      state: locationFromSelected || locationFromLogin || locationFromUser,
    };
    
    console.log('--- PROMOS SAGA: API payload prepared ---', payload);
    console.log('--- PROMOS SAGA: Final state value ---', payload.state);
    console.log('--- PROMOS SAGA: Attempting to fetch promos from API ---');
    
    const response = yield call(homePromosRequest, payload);
    
    console.log('--- PROMOS SAGA: API response received ---', response);
    console.log('--- PROMOS SAGA: Response data ---', response?.data);
    console.log('--- PROMOS SAGA: Response data length ---', response?.data?.length || 0);
    console.log('--- PROMOS SAGA: Response type ---', typeof response);
    console.log('--- PROMOS SAGA: Response is null ---', response === null);
    console.log('--- PROMOS SAGA: Response is undefined ---', response === undefined);
    
    if (response !== null) {
      console.log('--- PROMOS SAGA: Dispatching success action ---');
      yield put(homePromosActions.succeed(response));
      console.log('--- PROMOS SAGA: Success action dispatched ---');
    } else {
      console.log('--- PROMOS SAGA: Response is null, not dispatching success ---');
    }
  } catch (e) {
    console.log('--- PROMOS SAGA: ERROR occurred ---', e);
    console.log('--- PROMOS SAGA: Error message ---', e.message);
    console.log('--- PROMOS SAGA: Error response ---', e.response);
    console.log('--- PROMOS SAGA: Error stack ---', e.stack);
    console.log('--- PROMOS SAGA: Error name ---', e.name);
    yield put(homePromosActions.fail(e));
    yield call(showAlert, e.error);
  }
}

