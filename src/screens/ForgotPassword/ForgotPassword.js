/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Image,
  View,
  TouchableOpacity,
  BackHandler,
  Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Formik, Field } from 'formik';
import URTextfield from '../../components/URTextfield/URTextfield';
import ForgotPasswordValidators from './ForgotPasswordValidators';
import styles from './ForgotPassword.styles';
import { strings } from '../../utilities/localization/localization';
import { forgotPasswordRequestSagaAction } from '../../state/actions/sagas';
import URContainer from '../../components/URContainer/URContainer';
import Loader from '../../components/Loader/Loader';

const ForgotPassword = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.forgotPassword.isWaiting);
  const onSubmitForm = values => {
    const payload = {
      email: values.email,
    };
    dispatch(forgotPasswordRequestSagaAction(payload));
  };
  const dispatch = useDispatch();
  function handleBackButtonClick() {
    navigation.navigate('Login');
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return async () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.container }>
        <Image
          style={ styles.ImageStyle }
          source={ require('../../../assets/images/forgot_passowrd_icon.png') }
        />
        <Text style={ styles.forgotPasswordTxt }>{ strings('forgotPassword.forgotPassword') }</Text>
        <Text style={ styles.subTxt }>{ strings('forgotPassword.registerEmail') }</Text>
        <Text style={ styles.subTxt }>{ strings('forgotPassword.yourPassword') }</Text>
        <View style={ { width: '85%' } }>
          <Formik
            initialValues={ {
              email: '',
            } }
            validationSchema={ ForgotPasswordValidators }
            onSubmit={ values => {
              onSubmitForm(values);
            } }
          >
            { ({
              handleSubmit,
              isValid,
            }) => (
              <>
                <Field
                  labelContainerStyle={ { width: '87%', marginTop: 26 } }
                  placeholder={ strings('SignUp.emailPlaceholder') }
                  component={ URTextfield }
                  name='email'
                  autoCapitalize='none'
                  autoCorrect={ false }
                  label={ strings('SignUp.emailLabel') }
                  showAstric
                />
                <Button
                  onPress={ handleSubmit }
                  TouchableComponent={ TouchableOpacity }
                  containerStyle={ styles.containerStyle }
                  buttonStyle={ styles.buttonStyle }
                  titleStyle={ styles.titleStyle }
                  title={ strings('General.send') }
                  disabled={ !isValid }
                />
              </>
            ) }
          </Formik>
        </View>
        <View style={ styles.signUpContainer }>
          <Text style={ styles.accountText }>{ strings('forgotPassword.rememberPassword') }</Text>
          <TouchableOpacity onPress={ () => navigation.navigate('Login') }>
            <Text style={ styles.signUpText }>{ strings('General.login') }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </URContainer>
  );
};
export default ForgotPassword;
