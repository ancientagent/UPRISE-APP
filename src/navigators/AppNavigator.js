import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

// Import Screens directly
import Login from '../screens/Login/Login';
import Signup from '../screens/Signup/Signup';
import MailConfirmation from '../screens/mailConfirmation/mailConfirmation';
import UserLocation from '../screens/userLocation/userLocation';
import CommunityOnboarding from '../screens/CommunityOnboarding/CommunityOnboarding';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';
import AuthLoading from '../screens/AuthLoading/AuthLoading';
import Dashboard from './BottomTabs';
import SignupUserName from '../screens/Signup/Signup.userName.js';
import Analytics from '../screens/Analytics/Analytics';
import TestPlaces from '../screens/userLocation/testPlaces';

enableScreens();

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <RootStack.Screen name="AuthLoading" component={AuthLoading} />
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Signup" component={Signup} />
      <RootStack.Screen name="SignupUserName" component={SignupUserName} />
      <RootStack.Screen name="MailConfirmation" component={MailConfirmation} />
      <RootStack.Screen name="HomeSceneCreation" component={UserLocation} />
      <RootStack.Screen name="CommunityOnboarding" component={CommunityOnboarding} />
      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name='ChangePassword' component={ChangePassword} />
      <RootStack.Screen name="Analytics" component={Analytics} />
      <RootStack.Screen name="TestPlaces" component={TestPlaces} />

      {/* Main App Screen */}
      <RootStack.Screen name="Dashboard" component={Dashboard} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
