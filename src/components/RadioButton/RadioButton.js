import React from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import styles from './RadioButton.style';
import Colors from '../../theme/colors';

const RadioButton = props => {
  const {
    Data, selectedBtn, box, circleSize, initial,
  } = props;
  return (
    <>
      <RadioButtonRN
        data={ Data }
        style={ styles.radioButtonStyle }
        initial={ initial }
        selectedBtn={ selectedBtn }
        box={ box }
        activeColor={ Colors.radiumColour }
        circleSize={ circleSize }
        textStyle={ styles.textStyle }
      />
    </>
  );
};

export default RadioButton;
