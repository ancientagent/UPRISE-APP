import { takeLatest, put, call } from 'redux-saga/effects';
import { CommonActions } from '@react-navigation/native';
import { getUserDetailsType } from '../types/listener/listener';
import * as RootNavigation from '../../navigators/RootNavigation';
import TokenService from '../../utilities/TokenService';

function* handleUserDetailsSuccess(action) {
    try {
        console.log('--- AUTH NAVIGATION SAGA: getUserDetails succeeded ---');
        console.log('--- AUTH NAVIGATION SAGA: Action payload ---', JSON.stringify(action.payload, null, 2));
        
        // Extract user data from the action payload
        const response = action.payload;
        const user = response?.data?.data || response?.data || response;
        
        console.log('--- AUTH NAVIGATION SAGA: Extracted user data ---', JSON.stringify(user, null, 2));
        console.log(`--- AUTH NAVIGATION SAGA: onBoardingStatus is -> ${user?.onBoardingStatus} <-`);

        if (user && typeof user.onBoardingStatus !== 'undefined') {
            if (user.onBoardingStatus === 0) {
                console.log('--- AUTH NAVIGATION SAGA: DECISION -> INCOMPLETE ONBOARDING. Navigating to HomeSceneCreation.');
                // For incomplete onboarding, go directly to Home Scene Creation
                RootNavigation.resetRoot('HomeSceneCreation');
            } else {
                console.log('--- AUTH NAVIGATION SAGA: DECISION -> COMPLETE ONBOARDING. Navigating to Dashboard.');
                RootNavigation.resetRoot('Dashboard');
            }
        } else {
            console.log('--- AUTH NAVIGATION SAGA: ERROR - No onBoardingStatus found in user data ---');
            console.log('--- AUTH NAVIGATION SAGA: Available user keys ---', user ? Object.keys(user) : 'NO_USER_DATA');
            // Default to login if we can't determine onboarding status
            RootNavigation.resetRoot('Login');
        }
    } catch (error) {
        console.log('--- AUTH NAVIGATION SAGA: ERROR ---', error);
        // On error, navigate to login
        RootNavigation.resetRoot('Login');
    }
}

export default function* watchAuthNavigationSaga() {
    console.log('--- AUTH NAVIGATION SAGA: Watcher started ---');
    yield takeLatest(getUserDetailsType.Succeed, handleUserDetailsSuccess);
} 