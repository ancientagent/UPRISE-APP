import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  StatusBar, SafeAreaView, Dimensions,
} from 'react-native';
import Colors from '../../theme/colors';

const URHeaderContainer = props => {
  const { children } = props;
  const height = Dimensions.get('window').height - 50;
  return (
    <LinearGradient
      colors={ [Colors.ContainerColor, Colors.ContainerColor] }
      style={ { height } }
    >
      <SafeAreaView style={ { height } }>
        <StatusBar barStyle='light-content' />
        { children }
      </SafeAreaView>
    </LinearGradient>
  );
};
export default URHeaderContainer;

