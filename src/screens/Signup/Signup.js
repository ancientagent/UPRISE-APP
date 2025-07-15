/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Image, Platform, BackHandler, Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SvgImage from '../../components/SvgImage/SvgImage';
import URContainer from '../../components/URContainer/URContainer';
import upriseTxt from '../../../assets/images/upriseTxt.svg';
import orText from '../../../assets/images/orText.svg';
import styles from './Signup.styles';
import SignupForm from './Signup.form';
// import Googlebtn from '../../components/Googlebtn/Googlebtn';
import Loader from '../../components/Loader/Loader';
import Applebtn from '../../components/Applebtn/Applebtn';
import { signupRequestSagaAction } from '../../state/actions/sagas';

const Signup = props => {
  const { navigation, route } = props;
  const showLoading = useSelector(state => state.signup.isWaiting);
  const dispatch = useDispatch();

  function handleBackButtonClick() {
    navigation.navigate('Login');
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return async () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  const handleSignupComplete = (data) => {
    // Debug log
    console.log('Signup data:', data);
    // Submit to backend
    // eslint-disable-next-line no-undef
    const formDataObj = new FormData();
    formDataObj.append('firstName', data.firstName || 'User');
    formDataObj.append('lastName', data.lastName || '');
    formDataObj.append('userName', data.userName.trim());
    formDataObj.append('email', data.email);
    formDataObj.append('password', data.password.trim());
    formDataObj.append('mobile', data.mobile || '1234567890');
    formDataObj.append('gender', data.gender || 'PREFER NOT TO SAY');
    formDataObj.append('role', data.role || 'listener');
    
    // Only add band name if user is an artist
    if (data.role === 'artist' && data.bandName) {
      formDataObj.append('title', data.bandName.trim());
    }
    
    formDataObj.append('country', data.country || 'USA');
    
    dispatch(signupRequestSagaAction(formDataObj));
  };

  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
        keyboardShouldPersistTaps="handled"
      >
        <View style={ styles.container }>
          <SvgImage iconName={ upriseTxt } width={ 115 } height={ 27 } iconStyle={ styles.container } />
          
          {/* <Googlebtn /> */}
          <View style={styles.socialButtonPlaceholder}>
            <Text style={styles.placeholderText}>Login through Bandcamp</Text>
          </View>
          <View style={styles.socialButtonPlaceholder}>
            <Text style={styles.placeholderText}>Login through Soundcloud</Text>
          </View>
          <SvgImage iconName={ orText } width={ 115 } height={ 27 } iconStyle={ styles.orText } />
          <SignupForm 
            navigation={ navigation } 
            onComplete={handleSignupComplete}
          />
        </View>
      </KeyboardAwareScrollView>
    </URContainer>
  );
};

export default Signup;
