import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {hasValue} from '../../utilities/utilities';
import {accessToken, getUserDetails} from '../../state/selectors/UserProfile';
import {getUserDetailsSagaAction} from '../../state/actions/sagas';
import TokenService from '../../utilities/TokenService';
import URContainer from '../../components/URContainer/URContainer';
import Color from '../../theme/colors';
import styles from './AuthLoading.styles';

const AuthLoading = props => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const token = useSelector(accessToken);
  const details = useSelector(getUserDetails);
  const hasDispatchedRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasDispatchedRef.current) {
        hasDispatchedRef.current = true; // Set the flag immediately
        console.log('--- AUTH LOADING: Starting auth check ---');

        try {
          const token = await TokenService.getAccessToken();
          if (token) {
            console.log(
              '--- AUTH LOADING: Token found, dispatching getUserDetailsSagaAction ---',
            );
            dispatch(getUserDetailsSagaAction());
            // No timeout needed - authNavigation saga will handle navigation
          } else {
            console.log(
              '--- AUTH LOADING: No token, navigating to WelcomeScreen ---',
            );
            // No token, navigate to welcome screen
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'WelcomeScreen'}],
              }),
            );
          }
        } catch (error) {
          console.log('--- AUTH LOADING: Error during auth check ---', error);
          // On error, navigate to welcome screen
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'WelcomeScreen'}],
            }),
          );
        }
      }
    };
    checkAuth();
  }, []); // Remove dependencies to prevent infinite loop

  return (
    <URContainer safeAreaViewStyle={{flex: 1}}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Color.White} />
      </View>
    </URContainer>
  );
};

export default AuthLoading;
