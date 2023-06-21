/* eslint-disable global-require */
import React from 'react';
import {
  Image,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

const URCheckBox = props => {
  const {
    checked,
    iconSize,
    containerStyle,
    onPress,
  } = props;
  return (
    <CheckBox
      activeOpacity={ 1 }
      checked={ checked }
      checkedIcon={ (
        <Image
          style={ { height: iconSize, width: iconSize } }
          source={ require('../../../assets/images/check-square.png') }
        />
    ) }
      uncheckedIcon={ (
        <Image
          style={ { height: iconSize, width: iconSize } }
          source={ require('../../../assets/images/check.png') }
        />
    ) }
      containerStyle={ containerStyle }
      onPress={ onPress }
    />
  );
};

export default URCheckBox;
