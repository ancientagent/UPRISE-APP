/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable no-lone-blocks */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import {ScrollView} from 'react-native-virtualized-view';
import {useSelector, useDispatch} from 'react-redux';
import {Icon, Divider, Avatar} from 'react-native-elements';
import {Formik} from 'formik';
import MarqueeText from 'react-native-marquee';
import _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './ArtistProfileTab.styles';
import BlackEdit from '../../../../assets/images/BlackEdit.svg';
import SvgImage from '../../../components/SvgImage/SvgImage';
import Colors from '../../../theme/colors';
import {
  getUserDetails,
  getArtistProfile,
} from '../../../state/selectors/UserProfile';
import {currentScreenAction} from '../../../state/actions/currentScreen/currentScreen.action';
import {
  artistProfileSagaAction,
  updateArtistProfileSagaAction,
} from '../../../state/actions/sagas';
import {strings} from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';

const ArtistProfileTab = props => {
  const {navigation, EditMode, setEditMode} = props;
  const showLoading = useSelector(
    state =>
      state.artistProfile.isWaiting || state.updateArtistProfile.isWaiting,
  );
  const [artistLogo, setArtistLogo] = useState(null);
  const [artistLogoId, setArtistLogoId] = useState(null);

  const userDetails = useSelector(getUserDetails);
  const artistProfile = useSelector(getArtistProfile);
  const screenDetails = useSelector(state => state.currentScreen);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load artist profile data when component mounts
    if (userDetails.roleName === 'ARTIST') {
      dispatch(artistProfileSagaAction());
    }
  }, [userDetails.roleName]);

  useEffect(() => {
    // Update local state when artist profile data changes
    if (artistProfile && artistProfile.logo) {
      setArtistLogo(artistProfile.logo);
    }
  }, [artistProfile]);

  const ArtistProfileValidators = yup.object().shape({
    title: yup
      .string()
      .trim()
      .required(
        strings('userProfile.bandNameRequired') ||
          'Artist/Band name is required',
      ),
    description: yup
      .string()
      .max(255, 'Description must be 255 characters or less')
      .optional(),
  });

  const handleArtistProfileSubmit = values => {
    dispatch(currentScreenAction({...screenDetails, userProfileEdit: false}));
    const formData = {
      title: values.title.trim(),
      description: values.description || null,
      facebook: values.facebook || null,
      instagram: values.instagram || null,
      youtube: values.youtube || null,
      twitter: values.twitter || null,
      promosEnabled: values.promosEnabled || false,
    };

    // Add logo if provided
    if (artistLogo && artistLogo !== artistProfile?.logo) {
      formData.logo = artistLogo;
    }

    dispatch(updateArtistProfileSagaAction(formData));
    setEditMode(false);
  };

  const refreshLogo = (url, id) => {
    setArtistLogo(url);
    setArtistLogoId(id);
  };

  const renderArtistLogo = () => (
    <>
      <Avatar
        containerStyle={styles.ArtistLogo}
        size="large"
        rounded
        source={
          artistLogo
            ? {uri: artistLogo}
            : require('../../../../assets/images/band_defult_img.png')
        }
      />
    </>
  );

  const renderArtistInfo = () => {
    if (!artistProfile) {
      return null;
    }

    return (
      <View>
        <View style={styles.ArtistProfileView}>
          <View>
            <View>{renderArtistLogo()}</View>
          </View>
          <View style={styles.artistNameView}>
            <MarqueeText speed={0.2} marqueeOnStart loop delay={1000}>
              <Text style={styles.artistNameText}>{artistProfile.title} </Text>
            </MarqueeText>
            <MarqueeText speed={0.2} marqueeOnStart loop delay={1000}>
              <Text style={styles.descriptionText}>
                {artistProfile.description}
              </Text>
            </MarqueeText>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <View style={styles.statusView}>
            <Icon
              type="ionicon"
              name="checkmark-circle-outline"
              size={16}
              style={{marginRight: 14}}
              color={
                artistProfile.status === 'ACTIVE'
                  ? Colors.success
                  : Colors.error
              }
            />
            <Text style={{color: Colors.White}}>
              Status: {artistProfile.status}
            </Text>
          </View>
          <View style={styles.promosView}>
            <Icon
              type="ionicon"
              name="megaphone-outline"
              size={16}
              style={{marginRight: 14}}
              color={
                artistProfile.promosEnabled
                  ? Colors.success
                  : Colors.profileIconColor
              }
            />
            <Text style={{color: Colors.White}}>
              Promos: {artistProfile.promosEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
        <Divider
          orientation="horizontal"
          width={0.4}
          color={Colors.dividerColor}
          style={{marginTop: 14}}
        />
        <View style={{marginHorizontal: 24}}>
          <Text style={styles.socialPlatform}>
            {strings('socialPlatform.socialPlatform')}
          </Text>
          {artistProfile.facebook && (
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.facebook')}
              </Text>
              <Text style={styles.socialPlatformUserId}>
                {artistProfile.facebook}
              </Text>
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
          )}
          {artistProfile.instagram && (
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.instagram')}
              </Text>
              <Text style={styles.socialPlatformUserId}>
                {artistProfile.instagram}
              </Text>
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
          )}
          {artistProfile.youtube && (
            <>
              <Text style={styles.socialPlatformTitle}>YouTube</Text>
              <Text style={styles.socialPlatformUserId}>
                {artistProfile.youtube}
              </Text>
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
          )}
          {artistProfile.twitter && (
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.twitter')}
              </Text>
              <Text style={styles.socialPlatformUserId}>
                {artistProfile.twitter}
              </Text>
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
          )}
        </View>
      </View>
    );
  };

  const renderEditForm = () => (
    <Formik
      initialValues={{
        title: artistProfile?.title || '',
        description: artistProfile?.description || '',
        facebook: artistProfile?.facebook || '',
        instagram: artistProfile?.instagram || '',
        youtube: artistProfile?.youtube || '',
        twitter: artistProfile?.twitter || '',
        promosEnabled: artistProfile?.promosEnabled || false,
      }}
      validationSchema={ArtistProfileValidators}
      onSubmit={values => handleArtistProfileSubmit(values)}>
      {({handleChange, values, handleSubmit, errors, isValid}) => (
        <View>
          <View style={styles.ArtistProfileView}>
            <View>
              {renderArtistLogo()}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChangeAvatar', {onGoBack: refreshLogo});
                }}>
                <SvgImage
                  iconStyle={styles.editIconStyle}
                  iconName={BlackEdit}
                  height={10}
                  width={10}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.artistNameView}>
              <TextInput
                placeholder={
                  strings('userProfile.bandNamePlaceholder') ||
                  'Enter your artist or band name'
                }
                style={styles.artistNameText}
                placeholderTextColor={Colors.placeholderTextColor}
                onChangeText={handleChange('title')}
                value={values.title}
                maxLength={50}
              />
              {errors.title ? (
                <Text style={styles.errorTextStyle}>{errors.title}</Text>
              ) : null}
              <TextInput
                placeholderTextColor={Colors.placeholderTextColor}
                placeholder="Add artist description"
                style={styles.descriptionText}
                value={values.description}
                onChangeText={handleChange('description')}
                multiline
                maxLength={255}
              />
            </View>
          </View>
          <Divider
            orientation="horizontal"
            width={0.4}
            color={Colors.dividerColor}
            style={{marginTop: 14}}
          />
          <View style={{marginHorizontal: 24}}>
            <Text style={styles.socialPlatform}>
              {strings('socialPlatform.socialPlatform')}
            </Text>
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.facebook')}
              </Text>
              <TextInput
                style={styles.socialPlatformUserId}
                onChangeText={handleChange('facebook')}
                value={values.facebook}
                numberOfLines={1}
                maxLength={100}
                placeholder="Facebook URL"
                placeholderTextColor={Colors.placeholderTextColor}
              />
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.instagram')}
              </Text>
              <TextInput
                style={styles.socialPlatformUserId}
                onChangeText={handleChange('instagram')}
                value={values.instagram}
                numberOfLines={1}
                maxLength={100}
                placeholder="Instagram URL"
                placeholderTextColor={Colors.placeholderTextColor}
              />
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
            <>
              <Text style={styles.socialPlatformTitle}>YouTube</Text>
              <TextInput
                style={styles.socialPlatformUserId}
                onChangeText={handleChange('youtube')}
                value={values.youtube}
                numberOfLines={1}
                maxLength={100}
                placeholder="YouTube URL"
                placeholderTextColor={Colors.placeholderTextColor}
              />
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
            <>
              <Text style={styles.socialPlatformTitle}>
                {strings('socialPlatform.twitter')}
              </Text>
              <TextInput
                style={styles.socialPlatformUserId}
                onChangeText={handleChange('twitter')}
                value={values.twitter}
                numberOfLines={1}
                maxLength={100}
                placeholder="Twitter URL"
                placeholderTextColor={Colors.placeholderTextColor}
              />
              <Divider
                orientation="horizontal"
                width={1}
                color={Colors.dividerColor}
              />
            </>
            <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
              <Text
                style={[
                  styles.saveText,
                  {
                    color: !isValid
                      ? Colors.sideHeadingText
                      : Colors.radiumColour,
                  },
                ]}>
                {strings('userProfile.save') || 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );

  // Don't render if user is not an artist
  if (userDetails.roleName !== 'ARTIST') {
    return (
      <View style={styles.notArtistView}>
        <Text style={styles.notArtistText}>
          This section is only available for artists.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Loader visible={showLoading} />
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled">
        {!EditMode ? renderArtistInfo() : renderEditForm()}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default ArtistProfileTab;
