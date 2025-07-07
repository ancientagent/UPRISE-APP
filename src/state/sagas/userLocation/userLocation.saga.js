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
    console.log('--- DEBUG: Saga API Payload ---', JSON.stringify(payload, null, 2));
    const response = yield call(userLocationRequest, payload);
    console.log('--- DEBUG: API Success Response ---', response.data || response);
    if (response !== null) {
      yield put(userLocationRequestAction.succeed(response));
      yield put(getUserDetailsSagaAction());
      yield call(showAlert, 'Location saved successfully!');
      RootNavigation.navigate({ name: 'Home' });
    }
  } catch (error) {
    console.error('--- DEBUG: Saga API Error ---', error.response?.data || error);
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong while saving your location.';
    yield put(userLocationRequestAction.fail(errorMessage)); // Pass string directly, not object
    Alert.alert('Error', errorMessage);
  }
}

