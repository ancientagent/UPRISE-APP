import React from 'react';
import { Text, View } from 'react-native';
import { H2 } from 'native-base';
import { Input } from 'react-native-elements';
import styles from './URTextfield.styles';

const URTextfield = props => {
  const {
    placeholder,
    label,
    rightIcon,
    inputStyle,
    labelStyle,
    labelContainerStyle,
    hidelabel,
    inputBox,
    showAstric = false,
    field: {
      name, onBlur, onChange, value,
    },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];
  return (
    <>
      <View style={ [{ flexDirection: 'row' }, labelContainerStyle] }>
        { !hidelabel && <H2 style={ [styles.label, labelStyle] }>{ label }</H2> }
        { showAstric && <Text style={ styles.asstricStyle }>*</Text> }
      </View>
      <View style={ [styles.textInput, hasError ? styles.errorInput : inputBox] }>
        <Input
          placeholder={ placeholder }
          rightIcon={ rightIcon }
          inputContainerStyle={ styles.inputContainer }
          errorStyle={ { display: 'none' } }
          inputStyle={ [inputStyle, styles.inputText] }
          onChangeText={ text => onChange(name)(text) }
          onBlur={ () => {
            setFieldTouched(name);
            onBlur(name);
          } }
          value={ value }
        // eslint-disable-next-line react/jsx-props-no-spreading
          { ...inputProps }
        />
      </View>
      { hasError && <Text style={ styles.errorText }>{ errors[name] }</Text> }
    </>
  );
};

export default URTextfield;
