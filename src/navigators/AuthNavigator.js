import React from 'react';
import { Icon } from 'react-native-elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login/Login';
import Colors from '../theme/colors';
import SignupUserName from '../screens/Signup/Signup.userName';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import Signup from '../screens/Signup/Signup';
import UserLocation from '../screens/userLocation/userLocation';
import MailConfirmation from '../screens/mailConfirmation/mailConfirmation';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';
import GenreSelection from '../screens/GenreSelection/GenreSelection';
import AuthLoading from '../screens/AuthLoading/AuthLoading';

const AuthStack = createNativeStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      initialRouteName='AuthLoading'
      screenOptions={ ({ navigation }) => ({
        animationTypeForReplace: 'pop' && 'push',
        animation: 'none',
        headerStyle: { borderBottomWidth: 0 },
        gestureEnabled: false,
        animationEnabled: false,
        animationDuration: 0,
        headerLeft: () => (
          <>
            <Icon
              type='ionicon'
              name='chevron-back-outline'
              size={ 24 }
              color={ Colors.White }
              onPress={ () => navigation.goBack() }
            />
          </>
        ),
      }) }
    >
      <AuthStack.Screen name='AuthLoading' component={ AuthLoading } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen name='WelcomeScreen' component={ WelcomeScreen } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen name='GenreSelection' component={ GenreSelection } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen name='SignupUserName' component={ SignupUserName } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen name='Signup' component={ Signup } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen
        name='MailConfirmation'
        component={ MailConfirmation }
        options={ () => ({
          headerTitle: ' ',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTintColor: Colors.White,
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
        }) }
      />
      <AuthStack.Screen name='Login' component={ Login } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen name='UserLocation' component={ UserLocation } options={ () => ({ headerShown: false }) } />
      <AuthStack.Screen
        name='ForgotPassword'
        component={ ForgotPassword }
        options={ () => ({
          headerTitle: ' ',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: Colors.ContainerColor,
            borderBottomColor: 'transparent',
            shadowColor: 'transparent',
          },
          headerTintColor: Colors.White,
          headerLeftContainerStyle: {
            marginLeft: 24,
          },
        }) }
      />
    </AuthStack.Navigator>
  );
}
export default AuthStackScreen;
