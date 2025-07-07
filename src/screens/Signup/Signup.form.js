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
import RadioButton from '../../components/RadioButton/RadioButton';

const genderData = [{
  id: 1,
  label: 'Male',
  value: 'MALE',
}, {
  id: 2,
  label: 'Female',
  value: 'FEMALE',
}, {
  id: 3,
  label: 'Prefer not to say',
  value: 'PREFER NOT TO SAY',
}];

const SignupForm = props => {
  const { navigation, onComplete } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showRequire, setShowRequire] = useState(false);
  const [selectedGender, setSelectedGender] = useState('PREFER NOT TO SAY');
  const dispatch = useDispatch();
  
  const onSubmitForm = values => {
    if (onComplete) {
      // Pass form values directly with additional fields
      const completeData = {
        ...values,
        gender: selectedGender,
        country: 'USA',
        role: values.artistCheck ? 'artist' : 'listener',
      };
      onComplete(completeData);
    }
  };
  
  const screenHeight = Platform.OS === 'ios' ? 200 : 100;
  const height = Dimensions.get('window').height - screenHeight;
  
  return (
    <View style={ { height, width: '100%' } }>
      <Formik
        initialValues={ {
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          bandName: '',
          artistCheck: false,
          acceptTerms: false,
        } }
        validationSchema={ SignupValidators(showRequire, false) }
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

            {/* Artist Registration Checkbox */}
            <View style={styles.checkboxContainer}>
              <URCheckBox
                checked={values.artistCheck}
                onPress={() => setFieldValue('artistCheck', !values.artistCheck)}
                label={strings('SignUp.registerAsArtist')}
              />
            </View>

            {/* Band Name Field (conditional) */}
            {values.artistCheck && (
              <Field
                inputBox={ styles.inputBox }
                placeholder={strings('SignUp.bandNamePlaceholder')}
                component={ URTextfield }
                name='bandName'
                autoCapitalize='words'
                label={strings('SignUp.bandNameLabel')}
              />
            )}

            {/* Terms and Conditions Checkbox */}
            <View style={styles.checkboxContainer}>
              <URCheckBox
                checked={values.acceptTerms}
                onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                label={strings('SignUp.acceptTerms')}
              />
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
