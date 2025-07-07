/* eslint-disable global-require */
import React from 'react';
import {
  Image,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

const URCheckBox = ({ field, form, label, iconSize = 20, containerStyle, ...props }) => {
  // If used with Formik's Field, use field.value and form.setFieldValue
  const checked = field ? field.value : props.checked;
  const onChange = () => {
    if (form && field) {
      form.setFieldValue(field.name, !checked);
    }
    if (props.onPress) props.onPress();
  };
  return (
    <CheckBox
      title={label}
      checked={!!checked}
      onPress={onChange}
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
      containerStyle={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        elevation: 0,
        shadowColor: 'transparent',
        ...(containerStyle || {})
      }}
    />
  );
};

export default URCheckBox;
