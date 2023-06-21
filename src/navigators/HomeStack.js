/* eslint-disable no-shadow */
import React from 'react';
import { Icon } from 'react-native-elements';
import {
  Alert,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../theme/colors';
import Home from '../screens/Home/Home';
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
import AllMostPopularBands from '../screens/Statistics/AllMostPopularBands/AllMostPopularBands';
import AllMostRatedSongs from '../screens/Statistics/AllMostRatedSongs/AllMostRatedSongs';
import AllMostPlayedSongs from '../screens/Statistics/AllMostPlayedSongs/AllMostPlayedSongs';
import RadioStations from '../screens/Feed/RadioStations/RadioStations';
import ChangeAvatar from '../screens/userProfile/ProfileTab/ChangeAvatar';
import ChangeInstrument from '../screens/userProfile/ProfileTab/ChangeInstrument';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName='Home'
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
      <HomeStack.Screen name='Home' component={ Home } options={ () => ({ headerShown: false }) } />
      <HomeStack.Screen name='RadioStations' component={ RadioStations } options={ () => ({ headerShown: false }) } />
      <HomeStack.Screen name='AlbumSongs' component={ AlbumSongs } options={ () => ({ headerShown: false }) } />
      <HomeStack.Screen
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
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontFamily: 'Oswald Bold',
            fontWeight: '900',
            fontSize: 24,
          },
        }) }
      />
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
        name='AllMostPopularBands'
        component={ AllMostPopularBands }
        options={ () => ({
          headerTitle: 'Most Popular Bands',
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
      <HomeStack.Screen
        name='AllMostRatedSongs'
        component={ AllMostRatedSongs }
        options={ () => ({
          headerTitle: 'Most Rated Songs',
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
      <HomeStack.Screen
        name='AllMostPlayedSongs'
        component={ AllMostPlayedSongs }
        options={ () => ({
          headerTitle: 'Most Played Songs',
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
        name='AllAlbums'
        component={ AllAlbums }
        options={ () => ({
          headerTitle: 'Albums',
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
      <HomeStack.Screen
        name='AllBandSongs'
        component={ AllBandSongs }
        options={ () => ({
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
      <HomeStack.Screen name='Events' component={ Events } options={ () => ({ headerShown: false }) } />
      <HomeStack.Screen name='UserProfile' component={ UserProfile } options={ () => ({ headerShown: false }) } />
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
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
      <HomeStack.Screen
        name='OnDemandMusic'
        component={ OnDemandMusic }
        options={ ({ navigation }) => ({
          headerTitle: 'Playing Now',
          headerLeftContainerStyle: {
            marginLeft: 24,
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
          headerRightContainerStyle: {
            marginRight: 24,
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
    </HomeStack.Navigator>
  );
}
export default HomeStackScreen;

