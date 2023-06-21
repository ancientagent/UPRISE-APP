import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View, ActivityIndicator,
} from 'react-native';
import { hasValue } from '../../utilities/utilities';
import { accessToken, getUserDetails } from '../../state/selectors/UserProfile';
import URContainer from '../../components/URContainer/URContainer';
import Color from '../../theme/colors';
import styles from './AuthLoading.styles';

const AuthLoading = props => {
  const { navigation } = props;
  const token = useSelector(accessToken);
  const details = useSelector(getUserDetails);

  useEffect(() => {
    checkIsUserLoggedIn();
  }, [token]);

  const checkIsUserLoggedIn = () => {
    if (hasValue(token)) {
      if (details.onBoardingStatus === 2) {
        navigation.navigate({ name: 'Dashboard' });
      } else {
        navigation.navigate({ name: 'Login' });
      }
    } else {
      navigation.navigate('WelcomeScreen');
    }
  };
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <View style={ styles.container }>
        <ActivityIndicator size='large' color={ Color.White } />
      </View>
    </URContainer>
  );
};

export default AuthLoading;
