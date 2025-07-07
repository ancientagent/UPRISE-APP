import { takeLatest, put } from 'redux-saga/effects';
import { CommonActions } from '@react-navigation/native';
import { getUserDetailsType } from '../types/listener/listener';
import * as RootNavigation from '../../navigators/RootNavigation';

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
                console.log('--- AUTH NAVIGATION SAGA: DECISION -> NEW USER. Navigating to HomeSceneCreation.');
                RootNavigation.resetRoot('HomeSceneCreation');
            } else {
                console.log('--- AUTH NAVIGATION SAGA: DECISION -> RETURNING USER. Navigating to Dashboard.');
                RootNavigation.resetRoot('Dashboard');
            }
        } else {
            console.log('--- AUTH NAVIGATION SAGA: ERROR - No onBoardingStatus found in user data ---');
            console.log('--- AUTH NAVIGATION SAGA: Available user keys ---', user ? Object.keys(user) : 'NO_USER_DATA');
        }
    } catch (error) {
        console.log('--- AUTH NAVIGATION SAGA: ERROR ---', error);
    }
}

export default function* watchAuthNavigationSaga() {
    console.log('--- AUTH NAVIGATION SAGA: Watcher started ---');
    yield takeLatest(getUserDetailsType.Succeed, handleUserDetailsSuccess);
} 