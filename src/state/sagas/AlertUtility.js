/* eslint-disable consistent-return */
import { Alert } from 'react-native';
import { strings } from '../../utilities/localization/localization';

export function showNoNetworkAlert() {
  if (!global.isNetworkAlertShowing) {
    global.isNetworkAlertShowing = true;
    return new Promise(resolve => {
      Alert.alert(
        strings('Alert.noInternetTitle'),
        strings('Alert.noNetworkMessage'),
        [{
          text: strings('Alert.ok'),
          onPress() {
            global.isNetworkAlertShowing = false;
          },
        }],
        { cancelable: false, onDismiss() { resolve(); } },
      );
    });
  }
}
export default function showAlert(message) {
  if (message) {
    return new Promise(resolve => {
      Alert.alert(
        strings('Alert.title'),
        message,
        [{ text: strings('Alert.ok'), onPress() { resolve(); } }], // This function will continue Saga
        { cancelable: false, onDismiss() { resolve(); } },
      );
    });
  }
}
