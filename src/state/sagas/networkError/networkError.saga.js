import { takeLatest, call } from 'redux-saga/effects';
import { Alert } from 'react-native';
import { NETWORK_ERROR } from '../../types/ActionTypes';
import { strings } from '../../../utilities/localization/localization';

function showNoNetworkAlert() {
  Alert.alert(
    strings('NetworkError.title'),
    strings('NetworkError.message'),
    [{ text: strings('Alert.ok'), onPress: () => {} }],
    { cancelable: false },
  );
}

function* networkErrorSaga() {
  yield call(showNoNetworkAlert);
}

export default function* watchNetworkError() {
  yield takeLatest(NETWORK_ERROR, networkErrorSaga);
} 