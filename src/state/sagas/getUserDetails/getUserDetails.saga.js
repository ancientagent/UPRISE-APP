import {call, put, takeLatest, select} from 'redux-saga/effects';
import getUserDetailsRequest from '../../../services/getUserDetails/getUserDetails.service';
import {getUserDetailsSagaType} from '../../types/sagas';
import {getUserDetailsActions} from '../../actions/request/getUserDetails/getUserDetails.actions';
import showAlert from '../AlertUtility';
import {accessToken} from '../../selectors/UserProfile';
import TokenService from '../../../utilities/TokenService';

export default function* getUserDetailsWatcherSaga() {
  yield takeLatest(getUserDetailsSagaType, getUserDetailsWorkerSaga);
}

export function* getUserDetailsWorkerSaga() {
  console.log('--- GET USER DETAILS SAGA: Starting fetch ---');
  yield put(getUserDetailsActions.start());
  try {
    console.log('--- GET USER DETAILS SAGA: Getting user token ---');

    // First try Redux store
    let userToken = yield select(accessToken);
    console.log(
      '--- GET USER DETAILS SAGA: Token from Redux ---',
      userToken ? 'YES' : 'NO',
    );

    // If no token in Redux, check AsyncStorage
    if (!userToken) {
      console.log(
        '--- GET USER DETAILS SAGA: Checking AsyncStorage for token ---',
      );
      userToken = yield call(TokenService.getAccessToken);
      console.log(
        '--- GET USER DETAILS SAGA: Token from AsyncStorage ---',
        userToken ? 'YES' : 'NO',
      );
    }

    console.log(
      '--- GET USER DETAILS SAGA: Final token found ---',
      userToken ? 'YES' : 'NO',
    );

    if (!userToken) {
      console.log(
        '--- GET USER DETAILS SAGA: No token found anywhere - failing ---',
      );
      yield put(getUserDetailsActions.fail('No access token found'));
      return;
    }

    const payload = {
      accessToken: userToken,
    };

    console.log('--- GET USER DETAILS SAGA: Making API call ---');
    const response = yield call(getUserDetailsRequest, payload);
    console.log(
      '--- GET USER DETAILS SAGA: API call completed ---',
      response ? 'SUCCESS' : 'FAILED',
    );

    if (response !== null) {
      console.log('--- GET USER DETAILS SAGA: Fetch successful ---');
      console.log(
        '--- GET USER DETAILS SAGA: User data from API ---',
        JSON.stringify(response.data.data, null, 2),
      );

      console.log('--- GET USER DETAILS SAGA: Dispatching success action ---');
      yield put(getUserDetailsActions.succeed(response));
      console.log('--- GET USER DETAILS SAGA: Success action dispatched ---');

      console.log(
        '--- GET USER DETAILS SAGA: Process complete (navigation handled by authNavigation saga) ---',
      );
    } else {
      console.log('--- GET USER DETAILS SAGA: Response was null ---');
      console.log('--- GET USER DETAILS SAGA: Dispatching fail action ---');
      yield put(getUserDetailsActions.fail('Response was null'));
    }
  } catch (e) {
    console.log('--- GET USER DETAILS SAGA: ERROR ---', e);
    console.log('--- GET USER DETAILS SAGA: Error message ---', e.message);
    console.log('--- GET USER DETAILS SAGA: Error stack ---', e.stack);
    yield put(getUserDetailsActions.fail(e));
    yield call(showAlert, e.error);
  }
}
