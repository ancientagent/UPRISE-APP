import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  StatusBar, Dimensions, SafeAreaView,
} from 'react-native';
import Colors from '../../theme/colors';

const URContainer = props => {
  const { children, safeAreaViewStyle } = props;
  const { height } = Dimensions.get('window');
  return (
    <LinearGradient
      colors={ [Colors.ContainerColor, Colors.ContainerColor] }
      style={ { height } }
    >
      <SafeAreaView style={ safeAreaViewStyle }>
        <StatusBar barStyle='light-content' />
        { children }
      </SafeAreaView>
    </LinearGradient>
  );
};
export default URContainer;

