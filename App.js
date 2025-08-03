/**
 * @format
 */
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import TrackPlayer from 'react-native-track-player';
import {LogBox} from 'react-native';

// Core application imports
import AppNavigator from './src/navigators/AppNavigator';
import {navigationRef} from './src/navigators/RootNavigation';
import {store, storePersistor} from './src/state/store';
import {
  requestUserPermission,
  notificationListener,
} from './src/utilities/notificationServices';

const App = () => {
  React.useEffect(() => {
    // This code runs only after the component has successfully mounted.
    SplashScreen.hide();

    // Safely initialize services with error handling.
    try {
      TrackPlayer.setupPlayer();
      requestUserPermission();
      notificationListener();
    } catch (error) {
      console.error('UPRISE Service Initialization Error:', error);
    }

    // Ignore non-critical warnings.
    LogBox.ignoreLogs(['Reanimated 2']);
    LogBox.ignoreLogs(['Require cycle:']);
    LogBox.ignoreLogs(['`new NativeEventEmitter()`']);
  }, []); // The empty array ensures this runs only once.

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
