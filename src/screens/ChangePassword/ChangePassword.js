import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text, TouchableOpacity,
} from 'react-native';
import { Formik, Field } from 'formik';
import { Icon, Button } from 'react-native-elements';
import Colors from '../../theme/colors';
import URTextfield from '../../components/URTextfield/URTextfield';
import ChangePasswordValidators from './ChangePasswordValidators';
import styles from './ChangePassword.styles';
import { strings } from '../../utilities/localization/localization';
import { changePasswordSagaAction } from '../../state/actions/sagas';
import URContainer from '../../components/URContainer/URContainer';
import Loader from '../../components/Loader/Loader';

const ChangePassword = props => {
  const { navigation } = props;
  const [currentPassword, setCurrentPassword] = useState(true);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const showLoading = useSelector(state => state.changePassword.isWaiting);
  const dispatch = useDispatch();
  const onSubmitForm = values => {
    const payload = {
      currentPassword: values.currentPassword.trim(),
      password: values.confirmPassword.trim(),
    };
    dispatch(changePasswordSagaAction(payload));
  };
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.updatePasswordContainer }>
        <Formik
          initialValues={ {
            currentPassword: '',
            password: '',
            confirmPassword: '',
          } }
          validationSchema={ ChangePasswordValidators }
          onSubmit={ values => {
            onSubmitForm(values);
          } }
        >
          { ({
            handleSubmit,
            values,
            isValid,
          }) => (
            <>
              <Field
                inputBox={ styles.inputBox }
                placeholder={ strings('SignUp.passwordPlaceholder') }
                component={ URTextfield }
                value={ values.currentPassword.trim() }
                name='currentPassword'
                showAstric
                autoCapitalize='none'
                rightIcon={ (
                  <Icon
                    type='ionicon'
                    name={ currentPassword ? 'eye-off-outline' : 'eye-outline' }
                    size={ 18 }
                    color={ currentPassword ? Colors.textColor : Colors.URbtnColor }
                    onPress={ () => setCurrentPassword(!currentPassword) }
                  />
                ) }
                autoCorrect={ false }
                secureTextEntry={ !!currentPassword }
                label={ strings('Labels.currentPassword') }
              />
              <Field
                inputBox={ styles.inputBox }
                placeholder={ strings('createNewPassword.newPassword') }
                component={ URTextfield }
                name='password'
                value={ values.password.trim() }
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
                label={ strings('Labels.newPassword') }
              />
              <Field
                inputBox={ styles.inputBox }
                placeholder={ strings('SignUp.confirmPasswordPlaceholder') }
                component={ URTextfield }
                name='confirmPassword'
                value={ values.confirmPassword.trim() }
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
                label={ strings('Labels.confirmPassword') }
              />
              <Button
                buttonStyle={ styles.updatePassword }
                TouchableComponent={ TouchableOpacity }
                titleStyle={ styles.updatePasswordStyle }
                onPress={ handleSubmit }
                title={ strings('General.updatePassword') }
                disabled={ !isValid }
              />
              <TouchableOpacity onPress={ () => navigation.goBack() }>
                <Text style={ styles.cancelStyle }>Cancel</Text>
              </TouchableOpacity>
            </>
          ) }
        </Formik>
      </View>
    </URContainer>
  );
};
export default ChangePassword;
