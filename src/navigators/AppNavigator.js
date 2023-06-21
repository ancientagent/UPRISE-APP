import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage
from '@react-native-community/async-storage';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';
import { strings } from '../utilities/localization/localization';
import { netWorkPopupStatus } from '../state/actions';
import MiniPlayer from '../screens/MiniPlayer/MiniPlayer';
import { showminiPlayer } from '../utilities/utilities';
import {
  currentScreen,
} from '../state/selectors/UserProfile';
import OnDemandPlayer from '../screens/MiniPlayer/OnDemandPlayer';
import Colors from '../theme/colors';

const AuthStack = createNativeStackNavigator();
function RootNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={ () => ({
        headerShown: false,
        animationTypeForReplace: 'pop' && 'push',
        animation: 'none',
        animationDuration: 0,
        animationEnabled: false,
        gestureEnabled: false,
      }) }
      initialRouteName='Auth'
    >
      <AuthStack.Screen name='Auth' component={ AuthNavigator } />
      <AuthStack.Screen name='Dashboard' component={ BottomTabs } />
    </AuthStack.Navigator>
  );
}
const AppNavigator = props => {
  const { navState } = props;
  const dispatch = useDispatch();
  const isInternetAvailable = useSelector(state => state.network.isConnected);
  const isNetworkPopupDisplayed = useSelector(state => state.networkPopup.showPopup);
  const [playerState, setPlayerState] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const e = await AsyncStorage.getItem('onDemandPlayer');
      setPlayerState(e === 'active');
    }
    fetchData();
    if (!isInternetAvailable && isNetworkPopupDisplayed) { displayPopup(); }
    if (isInternetAvailable && !isNetworkPopupDisplayed) { dispatch(netWorkPopupStatus.showNetworkPopUp()); }
  }, [navState]);
  const displayPopup = () => {
    Alert.alert(
      strings('Alert.noInternetTitle'),
      strings('Alert.noNetworkMessage'),
      [
        {
          text: strings('Alert.ok'),
          onPress: () => {
            dispatch(netWorkPopupStatus.hideNetworkPopUp());
          },
        },
      ],
      { cancelable: false },
    );
  };
  const currentRoute = useSelector(currentScreen);
  const showPlayer = showminiPlayer.includes(currentRoute.screen);
  const [hideBottomTabs, setHideBottomTabs] = useState(false);
  useEffect(() => {
    setHideBottomTabs(currentRoute.userProfileEdit);
  }, [currentRoute.userProfileEdit]);
  const renderPlyaer = () => {
    if (((!playerState && currentRoute.screen === 'Home') || hideBottomTabs)) {
      return null;
    } else if (playerState) {
      return <OnDemandPlayer />;
    } else {
      <MiniPlayer />;
    }
    return <MiniPlayer />;
  };
  return (
    <>
      <RootNavigator />
      { showPlayer && (
      <View
        style={ {
          position: 'absolute',
          backgroundColor: Colors.Black,
          bottom: 100,
          flexDirection: 'row',
          width: '100%',
        } }
      >
        { renderPlyaer() }
      </View>
      ) }
    </>
  );
};
export default AppNavigator;
