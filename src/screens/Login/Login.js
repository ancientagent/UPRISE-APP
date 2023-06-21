/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Image, Platform, BackHandler,
} from 'react-native';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SvgImage from '../../components/SvgImage/SvgImage';
import URContainer from '../../components/URContainer/URContainer';
import Googlebtn from '../../components/Googlebtn/Googlebtn';
import upriseTxt from '../../../assets/images/upriseTxt.svg';
import orText from '../../../assets/images/orText.svg';
import LoginForm from './Login.form';
import styles from './Login.styles';
import Loader from '../../components/Loader/Loader';
import Applebtn from '../../components/Applebtn/Applebtn';

const Login = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.login.isWaiting || state.verifyUser.isWaiting);
  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return async () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <Loader
        visible={ showLoading }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={ {
          flex: 1, alignItems: 'center',
        } }
        enableOnAndroid
        extraHeight={ 130 }
        extraScrollHeight={ 130 }
        keyboardOpeningTime={ 0 }
        keyboardShouldPersistTaps='handled'
      >
        <View style={ styles.loginContainer }>
          <View style={ { alignItems: 'center' } }>
            <Image
              style={ styles.upriseRadiyoIcon }
              source={ require('../../../assets/images/upriseRadiyoIcon.png') }
            />
            <SvgImage iconName={ upriseTxt } width={ 115 } height={ 27 } iconStyle={ styles.container } />
            <Googlebtn navigation={ navigation } />
            { /* { Platform.OS === 'ios' && (
            <Applebtn />
            ) } */ }
            <SvgImage iconName={ orText } width={ 41 } height={ 15 } />
          </View>
          <LoginForm navigation={ navigation } />
        </View>
      </KeyboardAwareScrollView>
    </URContainer>
  );
};

export default Login;
