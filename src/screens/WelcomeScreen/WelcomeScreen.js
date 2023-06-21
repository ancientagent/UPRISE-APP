/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  BackHandler,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Login from '../Login/Login';
import WelcomeScreenSlides from './WelcomeScreenSlides';
import { welcomeSlideAction } from '../../state/actions/welcomeSlide/welcomeSlide.action';

const WelcomeScreen = props => {
  const { navigation } = props;
  const showSlide = useSelector(state => state.welcomeSlide.showIntro);
  const dispatch = useDispatch();
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
  const onDone = () => {
    const payload = {
      showIntro: false,
    };
    dispatch(welcomeSlideAction(payload));
  };

  const WelcomeSlides = () => (
    <WelcomeScreenSlides navigation={ navigation } onDone={ onDone } />
  );

  const renderLogin = () => (
    <Login navigation={ navigation } />
  );

  if (showSlide) {
    return WelcomeSlides();
  } else {
    return renderLogin();
  }
};
export default WelcomeScreen;
