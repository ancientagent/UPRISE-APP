import {call, put, takeLatest, select} from 'redux-saga/effects';
import _ from 'lodash';
import homeEventsRequest from '../../../services/homeEvents/homeEvents.service';
import {homeEventsSagaType} from '../../types/sagas';
import {homeEventsActions} from '../../actions/request/homeEvents/homeEvents.actions';
import showAlert from '../AlertUtility';
import {
  accessToken,
  getUserDetails,
  getUserLocation,
  loginData,
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
    console.log(
      '--- EVENTS SAGA: userToken ---',
      userToken ? 'Present' : 'Missing',
    );
    console.log('--- EVENTS SAGA: selectedLocation ---', selectedLocation);
    console.log('--- EVENTS SAGA: userLocation ---', userLocation);
    console.log('--- EVENTS SAGA: LoginData ---', LoginData);

    // FIXED: Use the correct location data from UserStationPrefrence
    // The location should come from the user's station preference created during onboarding
    let userStationLocation = '';

    // Try to get location from user details (which should contain station preference)
    // Backend returns: user.radioPrefrence.location, user.city, user.state
    if (
      selectedLocation &&
      selectedLocation.radioPrefrence &&
      selectedLocation.radioPrefrence.location
    ) {
      userStationLocation = selectedLocation.radioPrefrence.location;
    } else if (selectedLocation && selectedLocation.city) {
      userStationLocation = selectedLocation.city;
    } else if (selectedLocation && selectedLocation.state) {
      userStationLocation = selectedLocation.state;
    } else if (userLocation && userLocation.city) {
      userStationLocation = userLocation.city;
    } else if (LoginData && LoginData.user && LoginData.user.city) {
      userStationLocation = LoginData.user.city;
    }

    console.log('--- EVENTS SAGA: Location resolution ---');
    console.log(
      '--- EVENTS SAGA: userStationLocation ---',
      userStationLocation,
    );
    console.log(
      '--- EVENTS SAGA: selectedLocation.radioPrefrence ---',
      selectedLocation?.radioPrefrence,
    );
    console.log(
      '--- EVENTS SAGA: selectedLocation.city ---',
      selectedLocation?.city,
    );
    console.log(
      '--- EVENTS SAGA: selectedLocation.state ---',
      selectedLocation?.state,
    );

    // If we still don't have a location, use a default
    if (!userStationLocation) {
      console.log('--- EVENTS SAGA: No location found, using default ---');
      userStationLocation = 'Austin'; // Default fallback
    }

    const payload = {
      accessToken: userToken,
      state: userStationLocation,
    };

    console.log('--- EVENTS SAGA: API payload prepared ---', payload);
    console.log('--- EVENTS SAGA: Final state value ---', payload.state);
    console.log('--- EVENTS SAGA: Attempting to fetch events from API ---');

    const response = yield call(homeEventsRequest, payload);

    console.log('--- EVENTS SAGA: API response received ---', response);
    console.log('--- EVENTS SAGA: Response data ---', response?.data);
    console.log(
      '--- EVENTS SAGA: Response data length ---',
      response?.data?.length || 0,
    );
    console.log('--- EVENTS SAGA: Response type ---', typeof response);
    console.log('--- EVENTS SAGA: Response is null ---', response === null);
    console.log(
      '--- EVENTS SAGA: Response is undefined ---',
      response === undefined,
    );

    if (response !== null) {
      console.log('--- EVENTS SAGA: Dispatching success action ---');
      yield put(homeEventsActions.succeed(response));
      console.log('--- EVENTS SAGA: Success action dispatched ---');
    } else {
      console.log(
        '--- EVENTS SAGA: Response is null, not dispatching success ---',
      );
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
