/* eslint-disable no-shadow */
import React from 'react';
import { Icon } from 'react-native-elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Alert,
} from 'react-native';
import Colors from '../theme/colors';
import Discovery from '../screens/Discovery/Discovery';
import OtherProfile from '../screens/otherProfile/otherProfile';
import RadioScreen from '../screens/radioScreen/radioScreen';
import OnDemandMusic from '../screens/OnDemandMusic/OnDemandMusic';
import BandDetails from '../screens/BandDetails/BandDetails';
import UserProfile from '../screens/userProfile/userProfile';
import Events from '../screens/Events/Events';
import FollowersPage from '../screens/userProfile/FollowersPage/FollowersPage';
import Following from '../screens/userProfile/Following/Following';
import AllBandList from '../screens/BandDetails/AllBandList/AllBandList';
import AllAlbums from '../screens/BandDetails/AllAlbums/AllAlbums';
import AllBandSongs from '../screens/BandDetails/AllBandSongs/AllBandSongs';
import FullGalleryView from '../screens/BandDetails/FullGalleryView/FullGalleryView';
import FullEventView from '../screens/BandDetails/FullEventView/FullEventView';
import AlbumSongs from '../screens/BandDetails/AlbumSongs/AlbumSongs';
import RadioPreferences from '../screens/RadioPreferences/RadioPreferences';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import RadioStations from '../screens/Feed/RadioStations/RadioStations';
import ChangeAvatar from '../screens/userProfile/ProfileTab/ChangeAvatar';
import ChangeInstrument from '../screens/userProfile/ProfileTab/ChangeInstrument';
import AllPopularBands from '../screens/Discovery/AllPopularBands/AllPopularBands';
import AllTrendingSongs from '../screens/Discovery/AllTrendingSongs/AllTrendingSongs';
import AllPopularGenres from '../screens/Discovery/AllPopularGenres/AllPopularGenres';

const DiscoveryStack = createNativeStackNavigator();

function DiscoveryStackScreen() {
  return (
    <DiscoveryStack.Navigator
      initialRouteName='Discovery'
      screenOptions={ ({ navigation }) => ({
        animationTypeForReplace: 'pop' && 'push',
        animation: 'none',
        headerStyle: { borderBottomWidth: 0 },
        animationEnabled: false,
        animationDuration: 0,
        gestureEnabled: false,
        headerLeft: () => (
          <>
            <Icon
              type='ionicon'
              name='chevron-back-outline'
              size={ 24 }
              color={ Colors.White }
              onPress={ () => navigation.goBack() }
            />
          </>
        ),
      }) }
    >
      <DiscoveryStack.Screen name='Discovery' component={ Discovery } options={ () => ({ headerShown: false }) } />
      <DiscoveryStack.Screen
        name='RadioStations'
        component={ RadioStations }
        options={ () => ({ headerShown: false }) }
      />
      <DiscoveryStack.Screen
        name='AllPopularGenres'
        component={ AllPopularGenres }
        options={ () => ({
          headerTitle: 'Popular Genres',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='AllTrendingSongs'
        component={ AllTrendingSongs }
        options={ () => ({
          headerTitle: 'Popular Songs',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='AllPopularBands'
        component={ AllPopularBands }
        options={ () => ({
          headerTitle: 'Popular Bands',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen name='AlbumSongs' component={ AlbumSongs } options={ () => ({ headerShown: false }) } />
      <DiscoveryStack.Screen
        name='FollowersPage'
        component={ FollowersPage }
        options={ () => ({
          headerTitle: 'Followers',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='Following'
        component={ Following }
        options={ () => ({
          headerTitle: 'Following',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='ChangePassword'
        component={ ChangePassword }
        options={ () => ({
          headerTitle: 'Change Password',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='FullGalleryView'
        component={ FullGalleryView }
        options={ () => ({
          headerTitle: 'Gallery',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='FullEventView'
        component={ FullEventView }
        options={ () => ({
          headerTitle: 'Events',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='AllBandList'
        component={ AllBandList }
        options={ () => ({
          headerTitle: 'Band List',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='AllAlbums'
        component={ AllAlbums }
        options={ ({ navigation, route }) => ({
          headerTitle: route.params.isDiscovery ? 'Popular Albums' : 'Albums',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='AllBandSongs'
        component={ AllBandSongs }
        options={ ({ navigation, route }) => ({
          headerTitle: 'Songs',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen name='Events' component={ Events } options={ () => ({ headerShown: false }) } />
      <DiscoveryStack.Screen name='UserProfile' component={ UserProfile } options={ () => ({ headerShown: false }) } />
      <DiscoveryStack.Screen
        name='OtherProfile'
        component={ OtherProfile }
        options={ ({ route }) => ({
          headerTitle: route.params.userName ? route.params.userName : null,
          headerLeftContainerStyle: {
            marginHorizontal: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.White,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='RadioPreferences'
        component={ RadioPreferences }
        options={ () => ({
          headerTitle: 'Radio Preferences',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='BandDetails'
        component={ BandDetails }
        options={ () => ({
          headerTitle: 'Band Details',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='RadioScreen'
        component={ RadioScreen }
        options={ () => ({
          headerTitle: 'Uprise',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Regular',
            fontWeight: '400',
            fontSize: 20,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='OnDemandMusic'
        component={ OnDemandMusic }
        options={ ({ navigation }) => ({
          headerTitle: 'Playing Now',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerRightContainerStyle: {
            marginRight: 24,
          },
          headerLeft: () => (
            <>
              <Icon
                type='ionicon'
                name='chevron-back-outline'
                size={ 24 }
                color={ Colors.White }
                onPress={ async () => {
                  Alert.alert(
                    'Uprise',
                    'Now your’re switching to fairplayer',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Continue',
                        onPress: () => { navigation.goBack(); },
                      },
                    ],
                  );
                } }
              />
            </>
          ),
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Regular',
            fontWeight: '400',
            fontSize: 20,
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='ChangeAvatar'
        component={ ChangeAvatar }
        options={ () => ({
          headerTitle: 'Choose your avatar',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: 'Oswald Bold',
            fontWeight: '800',
          },
        }) }
      />
      <DiscoveryStack.Screen
        name='ChangeInstrument'
        component={ ChangeInstrument }
        options={ () => ({
          headerTitle: 'Instrument',
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
          headerBackTitleVisible: false,
          headerTitleAlign: 'left',
          headerTintColor: Colors.labelColor,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: 'Oswald Bold',
            fontWeight: '800',
          },
        }) }
      />
    </DiscoveryStack.Navigator>
  );
}
export default DiscoveryStackScreen;
