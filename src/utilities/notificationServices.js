import messaging from '@react-native-firebase/messaging';
import AsyncStorage
from '@react-native-community/async-storage';
import showAlert from '../state/sagas/AlertUtility';

export async function requestUserPermission() {
  await messaging().requestPermission();
  getFcmToken();
  // const authStatus = await messaging().requestPermission();
  // const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
  //   || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // if (enabled) {
  //   console.log('Authorization status:', authStatus);
  //   getFcmToken();
  // }
}

const getFcmToken = async () => {
  const checkToken = await AsyncStorage.getItem('fcmToken');
  console.log('the old token', checkToken);
  if (!checkToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('the new genrated token', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error rasied in fcmToken');
      showAlert(error.message);
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging().onMessage(async remoteMessage => {
    console.log('recived in foreground', remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
