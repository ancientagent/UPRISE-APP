import React, {useState} from 'react';
import {View, Text, Platform, Dimensions, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {Icon, Button} from 'react-native-elements';
import {Formik, Field} from 'formik';
import URTextfield from '../../components/URTextfield/URTextfield';
import Colors from '../../theme/colors';
import {strings} from '../../utilities/localization/localization';
import styles from './Signup.styles';
import SignupValidators from './SignupValidators';
import {signupRequestSagaAction} from '../../state/actions/sagas';
import URCheckBox from '../../components/URCheckBox/URCheckBox';
import RadioButton from '../../components/RadioButton/RadioButton';
import {Picker} from '@react-native-picker/picker';

const genderData = [
  {
    id: 1,
    label: 'Male',
    value: 'MALE',
  },
  {
    id: 2,
    label: 'Female',
    value: 'FEMALE',
  },
  {
    id: 3,
    label: 'Prefer not to say',
    value: 'PREFER NOT TO SAY',
  },
];

const SignupForm = props => {
  const {navigation, onComplete} = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showRequire, setShowRequire] = useState(false);
  const [selectedGender, setSelectedGender] = useState('PREFER NOT TO SAY');
  const dispatch = useDispatch();

  console.log('--- SIGNUP FORM is rendering ---');
  console.log('Navigation:', navigation);
  console.log('OnComplete:', onComplete);
  console.log('--- SIGNUP FORM: Environment check ---', {
    hasStrings: typeof strings !== 'undefined',
    stringsKeys: strings ? Object.keys(strings) : 'MISSING',
    hasColors: typeof Colors !== 'undefined',
    colorsKeys: Colors ? Object.keys(Colors) : 'MISSING',
  });

  const onSubmitForm = values => {
    console.log('--- SUBMIT BUTTON PRESSED ---');
    console.log('Values:', values);
    if (onComplete) {
      const completeData = {
        ...values,
        gender: selectedGender,
        country: 'USA',
        role: values.artistCheck ? 'artist' : 'listener',
        bandName: values.artistCheck ? values.bandName : '',
      };
      console.log('Complete data:', completeData);
      onComplete(completeData);
    }
  };

  return (
    <View
      style={{
        borderWidth: 5,
        borderColor: 'red',
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        DEBUG: Signup Form is rendering
      </Text>

      <Formik
        initialValues={{
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          artistCheck: false,
          bandName: '',
          acceptTerms: false,
        }}
        validationSchema={SignupValidators(showRequire, false)}
        onSubmit={value => onSubmitForm(value)}>
        {({handleSubmit, isValid, values, setFieldValue}) => {
          console.log('=== FORM VALUES ===', values);
          console.log('=== FORM VALID ===', isValid);

          return (
            <>
              <Text style={{color: 'white', fontSize: 14, marginBottom: 10}}>
                DEBUG: Form is valid: {isValid ? 'YES' : 'NO'}
              </Text>

              {/* Test Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: 'green',
                  padding: 10,
                  marginBottom: 20,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => {
                  console.log('=== TEST BUTTON PRESSED ===');
                  alert('Touch events are working!');
                }}>
                <Text style={{color: 'white', fontSize: 16}}>
                  TEST BUTTON - Press Me!
                </Text>
              </TouchableOpacity>

              <Field
                inputBox={styles.inputBox}
                placeholder={strings('SignUp.usernamePlaceholder')}
                component={URTextfield}
                value={values.userName.trim()}
                name="userName"
                autoCapitalize="none"
                autoCorrect={false}
                label={strings('SignUp.usernameLabel')}
                showAstric
              />
              <Field
                inputBox={styles.inputBox}
                placeholder={strings('SignUp.emailPlaceholder')}
                component={URTextfield}
                name="email"
                autoCapitalize="none"
                autoCorrect={false}
                label={strings('SignUp.emailLabel')}
                showAstric
              />
              <Field
                inputBox={styles.inputBox}
                placeholder={strings('SignUp.passwordPlaceholder')}
                component={URTextfield}
                value={values.password.trim()}
                name="password"
                showAstric
                autoCapitalize="none"
                rightIcon={
                  <Icon
                    type="ionicon"
                    name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={hidePassword ? Colors.textColor : Colors.URbtnColor}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                }
                autoCorrect={false}
                secureTextEntry={!!hidePassword}
                label={strings('SignUp.passwordLabel')}
              />
              <Field
                inputBox={styles.inputBox}
                placeholder={strings('SignUp.confirmPasswordPlaceholder')}
                component={URTextfield}
                value={values.confirmPassword.trim()}
                name="confirmPassword"
                showAstric
                autoCapitalize="none"
                rightIcon={
                  <Icon
                    type="ionicon"
                    name={
                      hideConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={18}
                    color={
                      hideConfirmPassword ? Colors.textColor : Colors.URbtnColor
                    }
                    onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                  />
                }
                autoCorrect={false}
                secureTextEntry={!!hideConfirmPassword}
                label={strings('SignUp.confirmPasswordLabel')}
              />

              {/* Artist Registration Checkbox */}
              <View
                style={[
                  styles.checkboxContainer,
                  {borderWidth: 2, borderColor: 'yellow'},
                ]}>
                <Text style={{color: 'white', fontSize: 12}}>
                  DEBUG: Artist checkbox
                </Text>
                <URCheckBox
                  checked={values.artistCheck}
                  onPress={() => {
                    console.log('Artist checkbox pressed');
                    setFieldValue('artistCheck', !values.artistCheck);
                  }}
                  label={strings('SignUp.registerAsArtist')}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                />
              </View>

              {/* Band Name Field (conditional) */}
              {values.artistCheck && (
                <Field
                  inputBox={styles.inputBox}
                  placeholder={strings('SignUp.bandNamePlaceholder')}
                  component={URTextfield}
                  name="bandName"
                  autoCapitalize="words"
                  label={strings('SignUp.bandNameLabel')}
                  showAstric
                />
              )}

              {/* Terms and Conditions Checkbox */}
              <View
                style={[
                  styles.checkboxContainer,
                  {borderWidth: 2, borderColor: 'yellow'},
                ]}>
                <Text style={{color: 'white', fontSize: 12}}>
                  DEBUG: Terms checkbox
                </Text>
                <URCheckBox
                  checked={values.acceptTerms}
                  onPress={() => {
                    console.log('Terms checkbox pressed');
                    setFieldValue('acceptTerms', !values.acceptTerms);
                  }}
                  label={strings('SignUp.acceptTerms')}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                />
              </View>

              <View style={{marginTop: 23}}>
                <Button
                  buttonStyle={styles.signupBtn}
                  titleStyle={styles.signupTitle}
                  onPress={() => {
                    console.log('=== SIGNUP BUTTON PRESSED ===');
                    handleSubmit();
                  }}
                  TouchableComponent={TouchableOpacity}
                  title={strings('SignUp.signUp')}
                  // disabled={ !isValid }
                />
                <View style={styles.signUpContainer}>
                  <Text style={styles.accountText}>
                    {strings('SignUp.account')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                      {strings('General.login')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default SignupForm;
