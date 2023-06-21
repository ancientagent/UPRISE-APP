/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Icon, Avatar, Chip } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import { getUserDetails, getRadioSong } from '../../state/selectors/UserProfile';
import styles from './CommonProfile.styles';
import SvgImage from '../../components/SvgImage/SvgImage';
import Edit from '../../../assets/images/Edit.svg';
import iconfinderRadio from '../../../assets/images/iconfinder_radio.svg';
import {
  getRadioSongSagaAction,
} from '../../state/actions/sagas';

const CommonProfile = props => {
  const { navigation, selectedTabId } = props;
  const dispatch = useDispatch();
  const songData = useSelector(getRadioSong);
  const userDetails = useSelector(getUserDetails);
  useEffect(() => {
    dispatch(getRadioSongSagaAction());
  }, []);
  const renderGenrText = genrLabel => (
    _.map(genrLabel, item => (
      <Chip
        title={ item.genre_name }
        TouchableComponent={ TouchableOpacity }
        type='solid'
        buttonStyle={ styles.buttonStyle }
        titleStyle={ styles.titleStyle }
      />
    ))
  );
  return (
    <View>
      <View style={ styles.homeContainer }>
        <TouchableOpacity style={ styles.profileContainer } onPress={ () => navigation.navigate('UserProfile') }>
          <Avatar
            containerStyle={ styles.profileImage }
            rounded
            source={ userDetails.avatar ? { uri: userDetails.avatar } : require('../../../assets/images/users.png') }
          />
          <View style={ styles.marqueeTextStyle }>
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
        </TouchableOpacity>
        { /* <Icon
          containerStyle={ { marginRight: 4 } }
          type='ionicon'
          name='notifications'
          size={ 20 }
          color={ Colors.White }
        /> */ }
      </View>
      <View style={ styles.locationContainer }>
        <View style={ styles.locationTextView }>
          <SvgImage iconStyle={ { right: 4 } } iconName={ iconfinderRadio } height={ 20 } width={ 20 } />
          <Text style={ styles.locationText }>
            { userDetails.radioPrefrence && userDetails.radioPrefrence.location }
          </Text>
        </View>
        <TouchableOpacity onPress={ () => navigation.navigate('RadioPreferences', { selectedTabId }) }>
          <SvgImage iconStyle={ { marginRight: 4 } } iconName={ Edit } height={ 15 } width={ 15 } />
        </TouchableOpacity>
      </View>
      { _.size(songData.genres) <= 2
        ? (
          <View style={ styles.generBtnContainer }>
            { renderGenrText(_.slice(songData.genres, 0, 3)) }
          </View>
        )
        : (
          <View style={ styles.generBtnContainer }>
            { renderGenrText(_.slice(songData.genres, 0, 3)) }
          </View>
        ) }
    </View>
  );
};

export default CommonProfile;
