import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import * as RootNavigation from '../../../navigators/RootNavigation';
import { Onboarding as OnboardingTypes } from '../../types';
import {
  getSuperGenresSuccess,
  getSuperGenresFailure,
  getCitySuggestionsSuccess,
  getCitySuggestionsFailure,
  validateCommunitySuccess,
  validateCommunityFailure,
} from '../../actions/onboarding';
import {
  getSuperGenres,
  getCitySuggestions,
  validateCommunity,
} from '../../../services/onboarding/onboarding.service';
import { showNetworkPopUp, hideNetworkPopUp } from '../../actions/network/Network.action';
import { getUserDetailsSagaAction } from '../../actions/sagas';

function* getSuperGenresSaga() {
  try {
    yield put(showNetworkPopUp());
    const response = yield call(getSuperGenres);
    yield put(getSuperGenresSuccess(response));
    yield put(hideNetworkPopUp());
  } catch (error) {
    yield put(getSuperGenresFailure(error));
    yield put(hideNetworkPopUp());
  }
}

function* getCitySuggestionsSaga(action) {
  try {
    // No loading indicator for autocomplete to avoid flashing
    const response = yield call(getCitySuggestions, action.payload.query);
    yield put(getCitySuggestionsSuccess(response));
  } catch (error) {
    yield put(getCitySuggestionsFailure(error));
  }
}

function* validateCommunitySaga(action) {
  try {
    yield put(showNetworkPopUp());
    const response = yield call(validateCommunity, action.payload.data);
    yield put(validateCommunitySuccess(response));

    if (response && response.status === 'active') {
      console.log('Community validation successful, navigating to Dashboard');
      yield put(getUserDetailsSagaAction());
      RootNavigation.navigate({ name: 'Dashboard' });
    } else {
      console.log('Community validation: status not active, staying on current screen');
      // Don't block navigation if community is not active
      // User can still continue with the app
    }
    
    yield put(hideNetworkPopUp());
  } catch (error) {
    console.log('Community validation failed:', error);
    yield put(validateCommunityFailure(error));
    yield put(hideNetworkPopUp());
    
    // Don't block the user if community validation fails
    // Allow them to continue using the app
    console.log('Community validation error - allowing user to continue');
  }
}

export default function* onboardingSaga() {
  yield takeLatest(OnboardingTypes.GET_SUPER_GENRES_REQUEST, getSuperGenresSaga);
  yield takeLatest(OnboardingTypes.GET_CITY_SUGGESTIONS_REQUEST, getCitySuggestionsSaga);
  yield takeLatest(OnboardingTypes.VALIDATE_COMMUNITY_REQUEST, validateCommunitySaga);
} 