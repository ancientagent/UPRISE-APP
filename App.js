/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import TrackPlayer from 'react-native-track-player';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigators/AppNavigator';
import reduxManager from './src/state/store';
import { navigationRef } from './src/navigators/RootNavigation';
import { requestUserPermission, notificationListener } from './src/utilities/notificationServices';
import messaging from '@react-native-firebase/messaging';

const { store, storePersistor } = reduxManager;

const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListener();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    SplashScreen.hide();
    TrackPlayer.setupPlayer();
    LogBox.ignoreLogs(['Reanimated 2']);
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={storePersistor}>
        <NavigationContainer ref={navigationRef} theme={DarkTheme}>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
