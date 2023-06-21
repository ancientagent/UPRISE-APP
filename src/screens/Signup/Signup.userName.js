/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import URCheckBox from '../../components/URCheckBox/URCheckBox';
import URContainer from '../../components/URContainer/URContainer';
import styles from './Signup.styles';
import URTextfield from '../../components/URTextfield/URTextfield';
import { strings } from '../../utilities/localization/localization';
import { verifyUserNameSagaAction } from '../../state/actions/sagas';
import Loader from '../../components/Loader/Loader';

const SignupUserNameValidators = value => yup.object().shape({
  userName: yup
    .string()
    .required(strings('SignupValidators.userNameRequired')),
  bandName: value ? yup.string().required('band name required').max(25, ({ max }) => `The max length of bandname is ${max} ${(strings('SignupValidators.characters'))}`) : yup.string().ensure(),
});
const SignupUserName = props => {
  const { route } = props;
  const [showRequire, setShowRequire] = useState(false);
  const showLoading = useSelector(state => state.verifyUserName.isWaiting);
  const { userInfo } = route.params;
  const dispatch = useDispatch();
  const onSubmitForm = values => {
    const payload = {
      userName: values.userName,
      email: userInfo.user.email,
      lastName: userInfo.user.familyName,
      firstName: userInfo.user.givenName,
      avatar: userInfo.user.photo,
      role: values.artistCheck ? 'artist' : 'listener',
      title: values.bandName,
    };
    dispatch(verifyUserNameSagaAction(payload));
  };
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.SignupUserNameContainer }>
        <View style={ styles.SignupUserNameHeadingView }>
          <Text style={ styles.SignupUserNameHeading }>
            { strings('SignupUserName.welcomeTo') }
          </Text>
          <Text style={ styles.SignupUserNameHeading }>
            { strings('SignupUserName.upriseRadiyo') }
          </Text>
          <Text style={ styles.SignupUserNameIndicationText }>
            { strings('SignupUserName.indicationText') }
          </Text>
        </View>
        <View style={ styles.SignupUserNameField }>
          <Formik
            initialValues={ {
              userName: '',
              artistCheck: false,
              bandName: '',
            } }
            validationSchema={ SignupUserNameValidators(showRequire) }
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
                  name='userName'
                  autoCapitalize='none'
                  autoCorrect={ false }
                  label={ strings('SignUp.usernameLabel') }
                  showAstric
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
                <View style={ { flexDirection: 'row', alignItems: 'center', marginTop: 10 } }>
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
                <View style={ { marginTop: 23 } }>
                  <Button
                    containerStyle={ styles.containerStyle }
                    buttonStyle={ styles.buttonStyle }
                    TouchableComponent={ TouchableOpacity }
                    titleStyle={ styles.titleStyle }
                    onPress={ handleSubmit }
                    title={ strings('SignupUserName.save') }
                    // disabled={ !isValid }
                  />
                </View>
              </>
            ) }
          </Formik>
        </View>
      </View>
    </URContainer>
  );
};
export default SignupUserName;
