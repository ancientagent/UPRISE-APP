/* eslint-disable global-require */
import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import WelcomeScreenSlides from './WelcomeScreenSlides';
import {welcomeSlideAction} from '../../state/actions/welcomeSlide/welcomeSlide.action';

const WelcomeScreen = props => {
  const {navigation} = props;
  const showSlide = useSelector(state => state.welcomeSlide.showIntro);
  const dispatch = useDispatch();

  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  useEffect(() => {
    // If the slides have already been shown, navigate to Login immediately.
    if (!showSlide) {
      navigation.replace('Login');
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [showSlide]);

  const onDone = () => {
    const payload = {
      showIntro: false,
    };
    dispatch(welcomeSlideAction(payload));
    // After finishing the slides, navigate to the Login screen.
    navigation.replace('Login');
  };

  // Only render the slides if they are supposed to be shown.
  // Otherwise, render nothing, as the useEffect will handle navigation.
  if (showSlide) {
    return <WelcomeScreenSlides navigation={navigation} onDone={onDone} />;
  }

  return null;
};

export default WelcomeScreen;
