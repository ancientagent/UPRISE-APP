/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable global-require */
import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import RNSplashScreen from 'react-native-splash-screen';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AsyncStorage
from '@react-native-community/async-storage';
import { navigationRef } from './src/navigators/RootNavigation';
import reduxManager from './src/state/store';
import AppNavigator from './src/navigators/AppNavigator';
import { requestUserPermission, notificationListener } from './src/utilities/notificationServices';

const { store, storePersistor } = reduxManager;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navState: null,
    };
  }

  async componentDidMount() {
    await AsyncStorage.setItem('playerState', 'pause');
    await AsyncStorage.setItem('onDemandPlayer', 'inactive');
    const checkToken = await AsyncStorage.getItem('fcmToken');
    if (checkToken === null) {
      requestUserPermission();
    }
    notificationListener();
    setTimeout(() => {
      RNSplashScreen.hide();
    }, 150);
    await TrackPlayer.setupPlayer({
      minBuffer: 300,
      playBuffer: 20,
      maxBuffer: 300,
      maxCacheFiles: 100,
    });
  }

  render() {
    const { navState } = this.state;
    return (
      <Provider store={ store }>
        <PersistGate loading={ null } persistor={ storePersistor }>
          { /* we used onStateChange to know the state of current nav e.g:
            onStateChange={ state => console.log('New state is', state) } */ }
          <NavigationContainer
            ref={ navigationRef }
            onStateChange={ state => this.setState({ navState: state }) }
            theme={ DarkTheme }
          >
            <AppNavigator navState={ navState } />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
