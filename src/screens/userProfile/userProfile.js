/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Platform,
} from 'react-native';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Avatar, Icon } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import URContainer from '../../components/URContainer/URContainer';
import Edit from '../../../assets/images/Edit.svg';
import SvgImage from '../../components/SvgImage/SvgImage';
import styles from './userProfile.styles';
import ProfileTab from './ProfileTab/ProfileTab';
import Colors from '../../theme/colors';
import { currentScreenAction } from '../../state/actions/currentScreen/currentScreen.action';
import Events from '../Events/Events';
import FavoritesTab from './FavoritesTab/FavoritesTab';
import { getUserDetails, currentScreen } from '../../state/selectors/UserProfile';

const UserProfile = props => {
  const { navigation } = props;
  const [selectedTab, setSelectedTab] = useState(1);
  const [showEdit, setShowEdit] = useState(true);
  const [EditMode, setEditMode] = useState(false);
  const screenDetails = useSelector(currentScreen);
  const userDetails = useSelector(getUserDetails);
  const screenData = useSelector(currentScreen);
  const dispatch = useDispatch();
  useEffect(() => {}, [userDetails]);
  useEffect(() => {
    setEditMode(screenDetails.userProfileEdit);
  }, [screenDetails.userProfileEdit]);
  const items = [{
    id: 1,
    title: 'Profile',
  },
  {
    id: 2,
    title: 'Calendar',
  },
  {
    id: 3,
    title: 'Favorites',
  },
  ];
  const renderContaint = () => {
    if (selectedTab === 1) {
      return <ProfileTab navigation={ navigation } EditMode={ EditMode } setEditMode={ setEditMode } />;
    } else if (selectedTab === 2) {
      return <Events navigation={ navigation } />;
    } else {
      return <FavoritesTab navigation={ navigation } />;
    }
  };
  const renderToggleButtons = () => {
    const toggleButtons = [];
    _.forEach(items, item => {
      toggleButtons.push(
        <TouchableOpacity
          onPress={ () => {
            if (!EditMode) {
              item.id !== 1 ? setShowEdit(false) : setShowEdit(true);
              setSelectedTab(item.id);
            } else {
              setEditMode(false);
              dispatch(currentScreenAction({ ...screenDetails, userProfileEdit: false }));
              item.id !== 1 ? setShowEdit(false) : setShowEdit(true);
              setSelectedTab(item.id);
            }
          } }
        >
          <Text style={ item.id === selectedTab ? styles.focusedStyle : styles.unfocusedStyle }>
            { item.title }
          </Text>
          <Divider
            orientation='horizontal'
            width={ 2 }
            color={ item.id === selectedTab ? Colors.URbtnColor : Colors.transparentColor }
            style={ { marginTop: 5 } }
          />
        </TouchableOpacity>,
      );
    });
    return (toggleButtons);
  };
  return (
    <URContainer>
      <View style={ !screenDetails.userProfileEdit ? {
        height: '94%',
        justifyContent: 'space-between',
      } : {
        height: '97%',
        justifyContent: 'space-between',
      } }
      >
        <View style={ [styles.userProfileView, !screenDetails.userProfileEdit && { height: selectedTab === 3 ? '78%' : '87%' }] }>
          <View style={ styles.homeContainer }>
            <View style={ styles.profileContainer }>
              { /* <Icon
              type='ionicon'
              name='chevron-back-outline'
              size={ 24 }
              color={ Colors.White }
              onPress={ () => navigation.goBack() }
            /> */ }
              <Avatar
                containerStyle={ styles.profileImage }
                rounded
                source={ userDetails.avatar ? { uri: userDetails.avatar } : require('../../../assets/images/users.png') }
              />
              <MarqueeText
                speed={ 0.2 }
                marqueeOnStart
                loop
                delay={ 1000 }
              >
                <Text style={ styles.profileText }>
                  { userDetails.userName }
                </Text>
              </MarqueeText>
            </View>
            { showEdit && (
            <>
              { !EditMode && (
              <TouchableOpacity onPress={ () => {
                setEditMode(!EditMode);
                dispatch(currentScreenAction({ ...screenDetails, userProfileEdit: true }));
              } }
              >
                <SvgImage iconStyle={ { marginRight: 4 } } iconName={ Edit } height={ 15 } width={ 15 } />
              </TouchableOpacity>
              ) }
            </>
            ) }
          </View>
          <View style={ { marginTop: 20 } }>
            <View style={ styles.conatiner }>
              { renderToggleButtons() }
            </View>
            <View style={ (!screenData.ondemandPlayerClose || !screenDetails.userProfileEdit) && { height: Platform.OS === 'ios' ? '87%' : '84%' } }>
              { renderContaint() }
            </View>
          </View>
        </View>
        <View style={ (!screenData.ondemandPlayerClose || !screenDetails.userProfileEdit) && styles.miniPlayerStyle } />
      </View>
    </URContainer>
  );
};

export default UserProfile;

