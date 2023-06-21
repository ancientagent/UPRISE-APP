/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View, Image, Platform, TouchableOpacity, Modal, Text, TextInput, BackHandler,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage
from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import HomeStackScreen from './HomeStack';
import { getRadioSong, currentScreen } from '../state/selectors/UserProfile';
import DiscoveryStackScreen from './DiscoveryStack';
import closeCircle from '../../assets/images/close-circle.svg';
import SvgImage from '../components/SvgImage/SvgImage';
import { currentScreenAction } from '../state/actions/currentScreen/currentScreen.action';
import ActionButtonsModel from '../screens/ActionButtonsModel/ActionButtonsModel';
import Colors from '../theme/colors';
import { songReportSagaAction } from '../state/actions/sagas';
import * as RootNavigation from './RootNavigation';
import styles from './BottomTabs.styles';
import ShowModelView from '../state/sagas/ShowModelView';
import { strings } from '../utilities/localization/localization';

const ModelView = () => <View />;
const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  const dispatch = useDispatch();
  const screenData = useSelector(currentScreen);
  function handleBackButtonClick() {
    TrackPlayer.destroy();
    dispatch(currentScreenAction({ ...screenData, userProfileEdit: false }));
    BackHandler.exitApp();
    return true;
  }
  const currentRoute = RootNavigation.getRootState();
  const [playerState, setPlayerState] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const e = await AsyncStorage.getItem('onDemandPlayer');
      setPlayerState(e === 'active');
    }
    fetchData();
    dispatch(currentScreenAction({ ...screenData, screen: currentRoute, userProfileEdit: false }));
    if (currentRoute === 'Home' || currentRoute === 'Discovery') {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }
    return async () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [currentRoute]);
  const songData = useSelector(getRadioSong);
  const [modalVisible, setModalVisible] = useState(false);
  const radioState = useSelector(state => state.getRadioSong.error);
  const [modelView, setModelView] = useState(false);
  useEffect(() => {
    setModelView(radioState !== null);
  }, [radioState]);
  const [reportModel, setReportModel] = useState(false);
  const [description, setDescription] = useState(null);
  const tabHiddenRoutes = ['ChangePassword', 'RadioPreferences', 'ChangeAvatar', 'OnDemandMusic', 'ChangeInstrument'];
  const hideTab = tabHiddenRoutes.includes(currentRoute);
  const handleSubmit = () => {
    setDescription(null);
    setReportModel(!reportModel);
    const payload = {
      songId: songData.songId,
      comment: description,
    };
    dispatch(songReportSagaAction(payload));
  };
  const onDone = () => setModelView(false);
  return (
    <>
      <Modal transparent statusBarTranslucent visible={ modelView }>
        <ShowModelView onDone={ onDone } />
      </Modal>
      <Modal
        transparent
        statusBarTranslucent
        visible={ modalVisible }
      >
        <View style={ styles.reportModelContainer }>
          { reportModel
            ? (
              <View style={ styles.reportModelView }>
                <View style={ { margin: 15 } }>
                  <TouchableOpacity
                    style={ {
                      alignSelf: 'flex-end',
                    } }
                    onPress={ () => setReportModel(!reportModel) }
                  >
                    <SvgImage
                      iconName={ closeCircle }
                      width={ 20 }
                      height={ 20 }
                    />
                  </TouchableOpacity>
                  <Text style={ styles.reportText }>
                    { strings('BottomNavigator.reportSong') }
                  </Text>
                  <Text style={ styles.commentText }>
                    { strings('BottomNavigator.comments') }
                  </Text>
                  <View style={ styles.TextBoxContainer }>
                    <TextInput
                      placeholder={ strings('BottomNavigator.enterComment') }
                      placeholderTextColor={ Colors.placeholderTextColor }
                      style={ styles.TextBoxView }
                      onChangeText={ text => setDescription(text) }
                      multiline
                      maxLength={ 200 }
                    />
                  </View>
                  <Button
                    containerStyle={ styles.containerStyle }
                    buttonStyle={ styles.buttonStyle }
                    TouchableComponent={ TouchableOpacity }
                    titleStyle={ styles.titleStyle }
                    onPress={ handleSubmit }
                    title={ strings('BottomNavigator.submit') }
                  />
                </View>
              </View>
            ) : (
              <ActionButtonsModel
                reportModel={ reportModel }
                modalVisible={ modalVisible }
                setModalVisible={ setModalVisible }
                setReportModel={ setReportModel }
              />
            ) }
        </View>
      </Modal>
      <Tab.Navigator
        initialRouteName='HomeStackScreen'
        screenOptions={ {
          animation: 'none',
          animationTypeForReplace: 'pop' && 'push',
          animationDuration: 0,
          animationEnabled: false,
          gestureEnabled: false,
          headerStyle: { borderBottomWidth: 0 },
          tabBarActiveTintColor: Colors.White,
          tabBarInactiveTintColor: Colors.eventDetailsTextColor,
          headerShown: false,
          tabBarBackground: () => (
            <Image
              style={ styles.tabBarBackgroundImg }
              source={ require('../../assets/images/URTabBase.png') }
            />
          ),
          // eslint-disable-next-line no-nested-ternary
          tabBarStyle: !hideTab ? styles.tabBarStyle : Platform.OS === 'ios' ? { display: 'none' } : { height: 0 },
        } }
      >
        <Tab.Screen
          name='HomeStackScreen'
          component={ HomeStackScreen }
          options={ () => ({
            tabBarIcon: ({ color }) => (
              <View style={ styles.homeIconStyle }>
                <Ionicons name='home-outline' color={ color } size={ 20 } />
                <Text style={ [styles.tabBarLabelStyle, { color }] }>
                  { strings('BottomNavigator.home') }
                </Text>
              </View>
            ),
            tabBarLabelStyle: { height: 0 },
            headerShown: false,
          }) }
        />
        <Tab.Screen
          name='bottomModel'
          component={ ModelView }
          options={ {
            tabBarLabel: '',
            tabBarIconStyle: !hideTab && { marginBottom: Platform.OS === 'ios' ? 53 : 85 },
            tabBarIcon: () => (
              <TouchableOpacity
                activeOpacity={ 0.7 }
                disabled={ !songData.songId || playerState }
                style={ styles.URNavigationButtonStyle }
                onPress={ () => {
                  setModalVisible(!modalVisible);
                } }
              >
                <Image
                  style={ styles.URNavigationButtonImg }
                  source={ require('../../assets/images/URNavigationButtonIcon.png') }
                />
              </TouchableOpacity>
            ),
            headerShown: false,
          } }
          listeners={ {
            tabPress: e => {
              e.preventDefault();
            },
          } }
        />
        <Tab.Screen
          name='DiscoveryStackScreen'
          component={ DiscoveryStackScreen }
          options={ () => ({
            tabBarIcon: ({ color }) => (
              <View style={ styles.discoveryIconStyle }>
                <Ionicons name='flag-outline' color={ color } size={ 20 } />
                <Text style={ [styles.tabBarLabelStyle, { color }] }>
                  { strings('BottomNavigator.discovery') }
                </Text>
              </View>
            ),
            tabBarLabelStyle: { height: 0 },
            headerShown: false,
          }) }
        />
      </Tab.Navigator>
    </>
  );
};
export default BottomTabs;
