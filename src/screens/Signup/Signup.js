/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Image, Platform, BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SvgImage from '../../components/SvgImage/SvgImage';
import URContainer from '../../components/URContainer/URContainer';
import upriseTxt from '../../../assets/images/upriseTxt.svg';
import orText from '../../../assets/images/orText.svg';
import styles from './Signup.styles';
import SignupForm from './Signup.form';
import Googlebtn from '../../components/Googlebtn/Googlebtn';
import Loader from '../../components/Loader/Loader';
import Applebtn from '../../components/Applebtn/Applebtn';

const Signup = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.signup.isWaiting);
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
  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={ {
          alignItems: 'center',
        } }
        enableOnAndroid
        keyboardOpeningTime={ 0 }
        keyboardShouldPersistTaps='handled'
      >
        <View style={ styles.signupContainer }>
          <Image
            style={ styles.upriseRadiyoIcon }
            source={ require('../../../assets/images/upriseRadiyoIcon.png') }
          />
          <SvgImage iconName={ upriseTxt } width={ 115 } height={ 27 } iconStyle={ styles.container } />
          <Googlebtn />
          { /* { Platform.OS === 'ios' && (
            <Applebtn />
          ) } */ }
          <SvgImage iconName={ orText } width={ 41 } height={ 15 } />
          <SignupForm navigation={ navigation } />
        </View>
      </KeyboardAwareScrollView>
    </URContainer>
  );
};
export default Signup;
