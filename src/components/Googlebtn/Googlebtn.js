import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import SvgImage from '../SvgImage/SvgImage';
import GoogleButton from '../../../assets/images/googleicon.svg';
import { strings } from '../../utilities/localization/localization';
import { verifyUserSagaAction } from '../../state/actions/sagas';
import styles from './Googlebtn.styles';

const Googlebtn = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '', // Add your web client ID from Firebase Console
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
    });
  }, []);
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(`userInfo ${JSON.stringify(userInfo)}`);
      const payload = {
        email: userInfo.user.email,
        userInfo,
      };
      dispatch(verifyUserSagaAction(payload));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (f.e. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated');
      } else if (error.message && error.message.includes('DEVELOPER_ERROR')) {
        console.log('Google Sign-In configuration error. Please add webClientId from Firebase Console.');
      } else {
        console.log('Google Sign-In error:', error.message);
      }
    }
  };
  return (
    <TouchableOpacity
      style={ styles.googleBtnView }
      activeOpacity={ 0.7 }
      onPress={ signIn }
    >
      <View style={ styles.contentView }>
        <SvgImage iconStyle={ styles.googleIcon } iconName={ GoogleButton } />
        <Text
          style={ styles.googleText }
        >
          { strings('Login.googleSigninText') }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Googlebtn;
