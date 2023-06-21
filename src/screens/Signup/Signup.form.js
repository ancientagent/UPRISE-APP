import React, { useState } from 'react';
import {
  View, Text, Platform, Dimensions, TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import { Formik, Field } from 'formik';
import URTextfield from '../../components/URTextfield/URTextfield';
import Colors from '../../theme/colors';
import { strings } from '../../utilities/localization/localization';
import styles from './Signup.styles';
import SignupValidators from './SignupValidators';
import { signupRequestSagaAction } from '../../state/actions/sagas';
import URCheckBox from '../../components/URCheckBox/URCheckBox';

const SignupForm = props => {
  const { navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showRequire, setShowRequire] = useState(false);
  const dispatch = useDispatch();
  const onSubmitForm = values => {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append('userName', values.userName.trim());
    formData.append('email', values.email);
    formData.append('password', values.password.trim());
    formData.append('role', values.artistCheck ? 'artist' : 'listener');
    formData.append('title', values.bandName);
    dispatch(signupRequestSagaAction(formData));
  };
  const screenHeight = Platform.OS === 'ios' ? 200 : 100;
  const height = Dimensions.get('window').height - screenHeight;
  return (
    <View style={ { height, width: '100%' } }>
      <Formik
        initialValues={ {
          userName: '',
          email: '',
          bandName: '',
          password: '',
          confirmPassword: '',
          artistCheck: false,
          privacyCheck: false,
        } }
        validationSchema={ SignupValidators(showRequire) }
        onSubmit={ value => onSubmitForm(value) }
      >
        { ({
          handleSubmit,
          isValid,
          values,
          setFieldValue,
        }) => (
          <>
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.usernamePlaceholder') }
              component={ URTextfield }
              value={ values.userName.trim() }
              name='userName'
              autoCapitalize='none'
              autoCorrect={ false }
              label={ strings('SignUp.usernameLabel') }
              showAstric
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.emailPlaceholder') }
              component={ URTextfield }
              name='email'
              autoCapitalize='none'
              autoCorrect={ false }
              label={ strings('SignUp.emailLabel') }
              showAstric
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.passwordPlaceholder') }
              component={ URTextfield }
              value={ values.password.trim() }
              name='password'
              showAstric
              autoCapitalize='none'
              rightIcon={ (
                <Icon
                  type='ionicon'
                  name={ hidePassword ? 'eye-off-outline' : 'eye-outline' }
                  size={ 18 }
                  color={ hidePassword ? Colors.textColor : Colors.URbtnColor }
                  onPress={ () => setHidePassword(!hidePassword) }
                />
                ) }
              autoCorrect={ false }
              secureTextEntry={ !!hidePassword }
              label={ strings('SignUp.passwordLabel') }
            />
            <Field
              inputBox={ styles.inputBox }
              placeholder={ strings('SignUp.confirmPasswordPlaceholder') }
              component={ URTextfield }
              value={ values.confirmPassword.trim() }
              name='confirmPassword'
              showAstric
              autoCapitalize='none'
              rightIcon={ (
                <Icon
                  type='ionicon'
                  name={ hideConfirmPassword ? 'eye-off-outline' : 'eye-outline' }
                  size={ 18 }
                  color={ hideConfirmPassword ? Colors.textColor : Colors.URbtnColor }
                  onPress={ () => setHideConfirmPassword(!hideConfirmPassword) }
                />
                ) }
              autoCorrect={ false }
              secureTextEntry={ !!hideConfirmPassword }
              label={ strings('SignUp.confirmPasswordLabel') }
            />
            { values.artistCheck && (
            <Field
              inputBox={ styles.inputBox }
              placeholder='Enter your band name'
              component={ URTextfield }
              name='bandName'
              autoCapitalize='none'
              autoCorrect={ false }
              label='Band name'
              showAstric
            />
            ) }
            <View style={ { marginTop: 10 } }>
              <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                <URCheckBox
                  checked={ values.artistCheck }
                  iconSize={ 16 }
                  containerStyle={ styles.iconContainer }
                  onPress={ () => {
                    setShowRequire(!values.artistCheck);
                    setFieldValue('artistCheck', !values.artistCheck);
                  } }
                />
                <Text style={ styles.checkText }>
                  { strings('SignUp.registerArtist') }
                </Text>
              </View>
              <View style={ { flexDirection: 'row', alignItems: 'center' } }>
                <URCheckBox
                  checked={ values.privacyCheck }
                  containerStyle={ styles.iconContainer }
                  iconSize={ 16 }
                  onPress={ () => setFieldValue('privacyCheck', !values.privacyCheck) }
                />
                <Text style={ styles.checkText }>
                  { strings('SignUp.conditionsAgree') }
                </Text>
                <Text style={ styles.highlightedText }>
                  { strings('SignUp.conditions') }
                </Text>
                <Text style={ styles.checkText }>
                  { strings('SignUp.and') }
                </Text>
                <Text style={ styles.highlightedText }>
                  { strings('SignUp.privacy') }
                </Text>
              </View>
            </View>
            <View style={ { marginTop: 23 } }>
              <Button
                buttonStyle={ styles.signupBtn }
                titleStyle={ styles.signupTitle }
                onPress={ handleSubmit }
                TouchableComponent={ TouchableOpacity }
                title={ strings('SignUp.signUp') }
                // disabled={ !isValid }
              />
              <View style={ styles.signUpContainer }>
                <Text style={ styles.accountText }>{ strings('SignUp.account') }</Text>
                <TouchableOpacity onPress={ () => navigation.navigate('Login') }>
                  <Text style={ styles.loginText }>{ strings('General.login') }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) }
      </Formik>
    </View>
  );
};

export default SignupForm;
