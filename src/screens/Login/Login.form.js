/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { Formik, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import URTextfield from '../../components/URTextfield/URTextfield';
import LoginValidationSchema from './LoginValidators';
import { strings } from '../../utilities/localization/localization';
import { loginRequestSagaAction } from '../../state/actions/sagas';
import styles from './Login.styles';
import Colors from '../../theme/colors';

const LoginForm = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [hidePassword, setHidePassword] = useState(true);

  const onSubmitForm = values => {
    const payload = {
      email: values.emailorUserName,
      password: values.password,
    };
    dispatch(loginRequestSagaAction(payload));
  };

  return (
    <View>
      <Formik
        initialValues={ { emailorUserName: '', password: '' } }
        validationSchema={ LoginValidationSchema }
        onSubmit={ values => onSubmitForm(values) }
      >
        { ({
          handleSubmit,
          isValid,
        }) => (
          <>
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('Login.emailorUserNamePlaceholder') }
              component={ URTextfield }
              name='emailorUserName'
              autoCapitalize='none'
              autoCorrect={ false }
              label={ strings('Login.emailorUserName') }
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('Login.passwordPlaceholder') }
              component={ URTextfield }
              name='password'
              autoCapitalize='none'
              rightIcon={ (
                <Icon
                  type='ionicon'
                  name={ hidePassword ? 'eye-off-outline' : 'eye-outline' }
                  size={ 18 }
                  color={ hidePassword ? Colors.textColor : Colors.URbtnColor }
                  onPress={ () => {
                    setHidePassword(!hidePassword);
                  } }
                />
                  ) }
              autoCorrect={ false }
              secureTextEntry={ !!hidePassword }
              label={ strings('Login.passwordLabel') }
            />
            <View style={ { marginTop: 10 } }>
              <Button
                buttonStyle={ styles.loginBtn }
                TouchableComponent={ TouchableOpacity }
                titleStyle={ styles.loginBtnStyle }
                onPress={ handleSubmit }
                title={ strings('General.login') }
                // disabled={ !isValid }
              />
              <TouchableOpacity onPress={ () => navigation.navigate('ForgotPassword') }>
                <Text style={ styles.forgotText }>{ strings('Login.forgotPassword') }</Text>
              </TouchableOpacity>
              <View style={ styles.signUpContainer }>
                <Text style={ styles.accountText }>{ strings('Login.dontHaveAccount') }</Text>
                <TouchableOpacity onPress={ () => navigation.navigate('Signup') }>
                  <Text style={ styles.signUpText }>{ strings('Login.signup') }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) }
      </Formik>
    </View>
  );
};

export default LoginForm;
