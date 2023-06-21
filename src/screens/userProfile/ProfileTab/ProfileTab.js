/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image,
} from 'react-native';
import * as yup from 'yup';
import { ScrollView } from 'react-native-virtualized-view';
// import ImagePicker from 'react-native-image-crop-picker';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Divider, Avatar } from 'react-native-elements';
import { Formik } from 'formik';
import MarqueeText from 'react-native-marquee';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './ProfileTab.styles';
import BlackEdit from '../../../../assets/images/BlackEdit.svg';
import SvgImage from '../../../components/SvgImage/SvgImage';
import Colors from '../../../theme/colors';
import { getUserDetails, currentScreen } from '../../../state/selectors/UserProfile';
import { currentScreenAction } from '../../../state/actions/currentScreen/currentScreen.action';
import { SIGN_OUT } from '../../../state/types/ActionTypes';
import { upDateProfileSagaAction, getUserAvatarSagaAction, getInstrumentSagaAction } from '../../../state/actions/sagas';
import { strings } from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';

const ProfileTab = props => {
  const { navigation, EditMode, setEditMode } = props;
  const showLoading = useSelector(state => state.getUserDetails.isWaiting);
  const [profileImage, setProfileImage] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [instrument, setInstrument] = useState(null);
  // const [visible, setVisible] = useState(false);
  const userDetails = useSelector(getUserDetails);
  const screenDetails = useSelector(currentScreen);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserAvatarSagaAction());
    dispatch(getInstrumentSagaAction());
  }, []);
  useEffect(() => {
    _.map(userDetails.instruments, data => setInstrument(data.url));
    setProfileImage(userDetails.avatar);
    setProfileId(userDetails.avatarId);
  }, [userDetails]);

  // const cameraImageUpload = async () => {
  //   ImagePicker.openCamera({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //     mediaType: 'photo',
  //     compressImageQuality: Platform.OS === 'android' ? 0.7 : 0.4,
  //   }).then(image => {
  //     setVisible(false);
  //     setProfileImage(image.path);
  //   });
  // };
  // const galleryImageUpload = async () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //     mediaType: 'photo',
  //     compressImageQuality: Platform.OS === 'android' ? 0.7 : 0.4,
  //   }).then(img => {
  //     setVisible(false);
  //     setProfileImage(img.path);
  //   });
  // };
  // const mobileRegex = /^([0|+[0-9]{1,5})?([7-9][0-9]{9})$/;
  const ProfileValidators = yup.object().shape({
    userName: yup
      .string()
      .trim()
      .required(strings('userProfile.usernameRequired')),
    mobile: yup
      .string()
      // .matches(mobileRegex, strings('userProfile.phoneNumber'))
      .min(10, strings('userProfile.phoneNumber'))
      .optional(),
  });
  const handleLogOut = () => {
    dispatch({ type: SIGN_OUT });
  };
  const renderAvatar = () => (
    <>
      <Avatar
        containerStyle={ styles.ProfileImage }
        size='large'
        rounded
        source={ profileImage ? { uri: profileImage } : require('../../../../assets/images/users.png') }
      />
    </>
  );
  const handleformSubmit = values => {
    dispatch(currentScreenAction({ ...screenDetails, userProfileEdit: false }));
    const formData = new FormData();
    formData.append('userId', userDetails.id);
    formData.append('userName', values.userName);
    formData.append('email', userDetails.email);
    { values.description === null || '' ? formData.append('about', null) : formData.append('about', values.description); }
    { values.mobile === null || '' ? formData.append('mobile', null) : formData.append('mobile', values.mobile); }
    { values.faceBookID === null || '' ? formData.append('facebook', null) : formData.append('facebook', values.faceBookID); }
    { values.instaID === null || '' ? formData.append('instagram', null) : formData.append('instagram', values.instaID); }
    { values.tweetID === null || '' ? formData.append('twitter', null) : formData.append('twitter', values.tweetID); }
    if (profileImage === null) {
      formData.append('avatar', null);
    } else {
      formData.append('avatar', profileImage);
      formData.append('avatarId', profileId);
    }
    dispatch(upDateProfileSagaAction(formData));
    setEditMode(false);
  };
  const refresh = (url, id) => {
    setProfileImage(url);
    setProfileId(id);
  };
  return (
    <ScrollView>
      <Loader
        visible={ showLoading }
      />
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={ 0 }
        keyboardShouldPersistTaps='handled'
      >
        { !EditMode
          ? (
            <View>
              <View style={ styles.ProfileTabView }>
                <View>
                  <View>
                    { renderAvatar() }
                  </View>
                </View>
                <View style={ styles.userNameView }>
                  <MarqueeText
                    speed={ 0.2 }
                    marqueeOnStart
                    loop
                    delay={ 1000 }
                  >
                    <Text style={ styles.userNameText }>
                      { userDetails.userName }
                      { ' ' }
                    </Text>
                    { instrument !== null
                    && (
                    <Image
                      style={ {
                        height: 25, width: 25,
                      } }
                      source={ { uri: instrument } }
                    />
                    ) }
                  </MarqueeText>
                  <MarqueeText
                    speed={ 0.2 }
                    marqueeOnStart
                    loop
                    delay={ 1000 }
                  >
                    <Text style={ styles.descriptionText }>
                      { userDetails.about }
                    </Text>
                  </MarqueeText>
                </View>
              </View>
              <View style={ { marginTop: 20 } }>
                <View style={ styles.mailIconView }>
                  <Icon
                    type='ionicon'
                    name='mail-outline'
                    size={ 16 }
                    style={ { marginRight: 14 } }
                    color={ Colors.profileIconColor }
                  />
                  <Text style={ { color: Colors.sideHeadingText } }>{ userDetails.email }</Text>
                </View>
                <View style={ styles.phoneIconView }>
                  <Icon
                    type='ionicon'
                    name='call-outline'
                    size={ 16 }
                    style={ { marginRight: 14 } }
                    color={ Colors.profileIconColor }
                  />
                  <Text style={ { color: Colors.White } }>{ userDetails.mobile }</Text>
                </View>
              </View>
              <Divider
                orientation='horizontal'
                width={ 0.4 }
                color={ Colors.dividerColor }
                style={ { marginTop: 14 } }
              />
              <View style={ styles.gridView }>
                <TouchableOpacity
                  style={ { alignItems: 'center' } }
                  onPress={ () => navigation.navigate('FollowersPage') }
                >
                  <Text style={ styles.followersCount }>
                    { userDetails.followers }
                  </Text>
                  <Text style={ styles.followersText }>
                    { strings('userProfile.followers') }
                  </Text>
                </TouchableOpacity>
                <Divider
                  orientation='vertical'
                  width={ 0.4 }
                  color={ Colors.dividerColor }
                />
                <TouchableOpacity style={ { alignItems: 'center' } } onPress={ () => navigation.navigate('Following') }>
                  <Text style={ styles.FollowingCount }>
                    { userDetails.following }
                  </Text>
                  <Text style={ styles.FollowingText }>
                    { strings('userProfile.following') }
                  </Text>
                </TouchableOpacity>
              </View>
              <Divider
                orientation='horizontal'
                width={ 0.4 }
                color={ Colors.dividerColor }
              />
              <View style={ { marginHorizontal: 24 } }>
                <Text style={ styles.socialPlatform }>
                  { strings('socialPlatform.socialPlatform') }
                </Text>
                <>
                  <Text style={ styles.socialPlatformTitle }>
                    { strings('socialPlatform.facebook') }
                  </Text>
                  <Text style={ styles.socialPlatformUserId }>
                    { userDetails.facebook }
                  </Text>
                  <Divider
                    orientation='horizontal'
                    width={ 1 }
                    color={ Colors.dividerColor }
                  />
                </>
                <>
                  <Text style={ styles.socialPlatformTitle }>
                    { strings('socialPlatform.instagram') }
                  </Text>
                  <Text style={ styles.socialPlatformUserId }>
                    { userDetails.instagram }
                  </Text>
                  <Divider
                    orientation='horizontal'
                    width={ 1 }
                    color={ Colors.dividerColor }
                  />
                </>
                <>
                  <Text style={ styles.socialPlatformTitle }>
                    { strings('socialPlatform.twitter') }
                  </Text>
                  <Text style={ styles.socialPlatformUserId }>
                    { userDetails.twitter }
                  </Text>
                  <Divider
                    orientation='horizontal'
                    width={ 1 }
                    color={ Colors.dividerColor }
                  />
                </>
              </View>
              <TouchableOpacity
                onPress={ () => navigation.navigate('ChangePassword') }
                style={ { marginTop: 10 } }
              >
                <Text style={ styles.logoutText }>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={ () => navigation.navigate('ChangeInstrument') }
                style={ { marginTop: 10 } }
              >
                <Text style={ styles.logoutText }>Instruments interested in</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ handleLogOut }>
                <Text style={ styles.logoutText }>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Formik
              initialValues={ {
                userName: userDetails.userName,
                description: userDetails.about === null ? '' : userDetails.about,
                mobile: userDetails.mobile === null ? '' : userDetails.mobile,
                faceBookID: userDetails.facebook === null ? '' : userDetails.facebook,
                instaID: userDetails.instagram === null ? '' : userDetails.instagram,
                tweetID: userDetails.twitter === null ? '' : userDetails.twitter,
              } }
              validationSchema={ ProfileValidators }
              onSubmit={ values => handleformSubmit(values) }
            >
              { ({
                handleChange, values, handleSubmit, errors, isValid,
              }) => (
                <View>
                  <View style={ styles.ProfileTabView }>
                    <View>
                      { renderAvatar() }
                      <TouchableOpacity
                        onPress={ () => {
                          navigation.navigate('ChangeAvatar', { onGoBack: refresh });
                        } }
                      >
                        <SvgImage
                          iconStyle={ styles.editIconStyle }
                          iconName={ BlackEdit }
                          height={ 10 }
                          width={ 10 }
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={ styles.userNameView }>
                      <TextInput
                        placeholder={ strings('userProfile.usernamePlaceholder') }
                        style={ styles.userNameText }
                        placeholderTextColor={ Colors.placeholderTextColor }
                        onChangeText={ handleChange('userName') }
                        value={ values.userName }
                        maxLength={ 25 }
                      />
                      { errors.userName ? (
                        <Text style={ styles.errorTextStyle }>
                          { errors.userName }
                        </Text>
                      ) : null }
                      <TextInput
                        placeholderTextColor={ Colors.placeholderTextColor }
                        placeholder={ strings('userProfile.addDescription') }
                        style={ styles.descriptionText }
                        value={ values.description }
                        onChangeText={ handleChange('description') }
                        multiline
                        maxLength={ 200 }
                      />
                    </View>
                  </View>
                  <View style={ { marginTop: 20 } }>
                    <View style={ styles.mailIconView }>
                      <Icon
                        type='ionicon'
                        name='mail-outline'
                        size={ 16 }
                        style={ { marginRight: 14 } }
                        color={ Colors.profileIconColor }
                      />
                      <Text style={ { color: Colors.sideHeadingText } }>{ userDetails.email }</Text>
                    </View>
                    <View style={ styles.phoneIconView }>
                      <Icon
                        type='ionicon'
                        name='call-outline'
                        size={ 16 }
                        style={ { marginRight: 14 } }
                        color={ Colors.profileIconColor }
                      />
                      <TextInput
                        keyboardType='numeric'
                        placeholderTextColor={ Colors.placeholderTextColor }
                        placeholder={ strings('userProfile.addPhoneno') }
                        style={ styles.phoneNoInputStyle }
                        value={ values.mobile }
                        onChangeText={ handleChange('mobile') }
                        maxLength={ 10 }
                      />
                    </View>
                    { errors.mobile ? (
                      <Text style={ styles.errorText }>
                        { errors.mobile }
                      </Text>
                    ) : null }
                  </View>
                  <Divider
                    orientation='horizontal'
                    width={ 0.4 }
                    color={ Colors.dividerColor }
                    style={ { marginTop: 14 } }
                  />
                  <View style={ { marginHorizontal: 24 } }>
                    <Text style={ styles.socialPlatform }>
                      { strings('socialPlatform.socialPlatform') }
                    </Text>
                    <>
                      <Text style={ styles.socialPlatformTitle }>
                        { strings('socialPlatform.facebook') }
                      </Text>
                      <TextInput
                        style={ styles.socialPlatformUserId }
                        onChangeText={ handleChange('faceBookID') }
                        value={ values.faceBookID }
                        numberOfLines={ 1 }
                        maxLength={ 20 }
                      />
                      <Divider
                        orientation='horizontal'
                        width={ 1 }
                        color={ Colors.dividerColor }
                      />
                    </>
                    <>
                      <Text style={ styles.socialPlatformTitle }>
                        { strings('socialPlatform.instagram') }
                      </Text>
                      <TextInput
                        style={ styles.socialPlatformUserId }
                        onChangeText={ handleChange('instaID') }
                        value={ values.instaID }
                        numberOfLines={ 1 }
                        maxLength={ 20 }
                      />
                      <Divider
                        orientation='horizontal'
                        width={ 1 }
                        color={ Colors.dividerColor }
                      />
                    </>
                    <>
                      <Text style={ styles.socialPlatformTitle }>
                        { strings('socialPlatform.twitter') }
                      </Text>
                      <TextInput
                        style={ styles.socialPlatformUserId }
                        onChangeText={ handleChange('tweetID') }
                        value={ values.tweetID }
                        numberOfLines={ 1 }
                        maxLength={ 20 }
                      />
                      <Divider
                        orientation='horizontal'
                        width={ 1 }
                        color={ Colors.dividerColor }
                      />
                    </>
                    <TouchableOpacity onPress={ handleSubmit } disabled={ !isValid }>
                      <Text
                        style={ [styles.saveText, { color: !isValid ? Colors.sideHeadingText : Colors.radiumColour }] }
                      >
                        { strings('userProfile.save') }
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) }
            </Formik>
          ) }
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};
export default ProfileTab;
