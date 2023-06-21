import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import SvgImage from '../SvgImage/SvgImage';
import appleIcon from '../../../assets/images/appleIcon.svg';
import { strings } from '../../utilities/localization/localization';
import { verifyUserSagaAction } from '../../state/actions/sagas';
import styles from './Applebtn.styles';

const jwtDecode = require('jwt-decode');

const Applebtn = () => {
  const dispatch = useDispatch();
  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME,
        ],
      });

      const token = appleAuthRequestResponse.identityToken;
      const decoded = jwtDecode(token);
      const payload = {
        email: decoded.email,
      };
      console.log('payload', payload, decoded);
      // const {
      //   user: newUser,
      //   email,
      //   nonce,
      //   identityToken,
      //   realUserStatus /* etc */,
      // } = appleAuthRequestResponse;

      // this.user = newUser;

      // this.fetchAndUpdateCredentialState()
      //   .then(res => this.setState({ credentialStateForUser: res }))
      //   .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }));

      // if (identityToken) {
      //   // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      //   console.log(nonce, identityToken);
      // } else {
      //   // no token - failed sign-in?
      // }

      // if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
      //   console.log("I'm a real person!");
      // }

      // console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };
  return (
    <TouchableOpacity
      style={ styles.googleBtnView }
      activeOpacity={ 0.7 }
      onPress={ onAppleButtonPress }
    >
      <View style={ styles.contentView }>
        <SvgImage iconStyle={ styles.googleIcon } iconName={ appleIcon } />
        <Text
          style={ styles.googleText }
        >
          { strings('Login.appleSigninText') }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Applebtn;
