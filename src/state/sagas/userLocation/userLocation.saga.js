import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import userLocationRequest from '../../../services/userLocation/userLocation.service';
import { userLocationSagaType } from '../../types/sagas';
import { userLocationRequestAction } from '../../actions/request/userLocation/userLocation.actions';
import showAlert from '../AlertUtility';
import { accessToken } from '../../selectors/UserProfile';
import { getUserDetailsSagaAction } from '../../actions/sagas';
import { Alert } from 'react-native';

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
    console.log('--- USER LOCATION SAGA: API Payload ---', JSON.stringify(payload, null, 2));
    
    // Call the backend API - this already creates the station preference and updates onBoardingStatus to 2
    const response = yield call(userLocationRequest, payload);
    console.log('--- USER LOCATION SAGA: API Success Response ---', response.data || response);
    
    if (response !== null) {
      yield put(userLocationRequestAction.succeed(response));
      yield call(showAlert, 'Welcome to your scene! Location and preferences saved successfully!');
      
      console.log('--- USER LOCATION SAGA: Location and station preference created. Fetching updated user details. ---');
      
      // Fetch updated user details - this will trigger auth navigation to Dashboard
      // since onBoardingStatus will now be 2 (completed)
      yield put(getUserDetailsSagaAction());
      
      console.log('--- USER LOCATION SAGA: Auth navigation will handle routing to Dashboard ---');
    }
  } catch (error) {
    console.error('--- USER LOCATION SAGA: API Error ---', error.response?.data || error);
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while saving your location.';
    yield put(userLocationRequestAction.fail(errorMessage));
    Alert.alert('Error', errorMessage);
  }
}

