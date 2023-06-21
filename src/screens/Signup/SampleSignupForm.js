/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  SafeAreaView,
  Button,
  Image,
  View,
  Platform,
  Text,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik, Field } from 'formik';
import { Menu, MenuItem } from 'react-native-material-menu';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon } from 'react-native-elements';
import URTextfield from '../../components/URTextfield/URTextfield';
import RadioButton from '../../components/RadioButton/RadioButton';
import SignupValidators from './SignupValidators';
import styles from './Signup.styles';
import { strings } from '../../utilities/localization/localization';
import { signupRequestSagaAction } from '../../state/actions/sagas';

const genderData = [{
  id: 1,
  label: strings('staticLables.male'),
  value: 'male',
}, {
  id: 2,
  label: strings('staticLables.female'),
  value: 'female',
}, {
  id: 3,
  label: strings('staticLables.other'),
  value: 'other',
}];

export const onSubmitForm = (dispatch, values, genderSelect, navigation, profileImage) => {
  // eslint-disable-next-line no-param-reassign
  values.gender = genderSelect;
  const formData = new FormData();
  formData.append('firstName', values.firstName);
  formData.append('lastName', values.lastName);
  formData.append('gender', values.gender);
  formData.append('mobile', values.mobile);
  formData.append('email', values.email);
  formData.append('password', values.confirmPassword);
  formData.append('role', 'listener');
  if (profileImage) {
    const timeStamp = Math.round(new Date().getTime() / 1000);
    const fileType = profileImage.path.split('.').pop();
    const fileExtension = (fileType.toLowerCase() === 'jpeg' || fileType.toLowerCase() === 'jpg' || fileType.toLowerCase() === 'png') ? fileType : 'gif';
    const photo = {
      // uri: Platform.OS === 'ios' ? profileImage.path.replace('file://', '') : profileImage.path,
      uri: profileImage.path,
      type: `image/${fileExtension}`,
      name: `${timeStamp}.${fileExtension}`,
    };
    formData.append('avatar', photo);
  }
  dispatch(signupRequestSagaAction(formData));
  navigation.navigate('SignupSubmit');
};
export default function Signup(props) {
  const { navigation } = props;
  const [profileImage, setProfileImage] = useState(null);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [genderSelect, setGenderSelect] = useState(1);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const cameraImageUpload = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'android' ? 0.7 : 0.4,
    }).then(image => {
      setVisible(false);
      setProfileImage(image);
    });
  };
  const galleryImageUpload = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'android' ? 0.7 : 0.4,
    }).then(img => {
      setVisible(false);
      setProfileImage(img);
    });
  };
  return (
    <View style={ styles.container }>
      <StatusBar barStyle='light-content' />
      <SafeAreaView>
        <KeyboardAwareScrollView>
          <View style={ styles.signupContainer }>
            <Text style={ styles.signupText }>{ strings('General.signup') }</Text>
            <Formik
              initialValues={ {
                firstName: '',
                lastName: '',
                gender: '',
                mobile: '',
                email: '',
                createPassword: '',
                confirmPassword: '',
              } }
              validationSchema={ SignupValidators }
              onSubmit={ values => {
                onSubmitForm(dispatch, values, genderSelect, navigation, profileImage);
              } }
            >
              { ({
                handleSubmit,
                isValid,
              }) => (
                <>
                  { profileImage && (
                  <Image
                    source={ { uri: profileImage.path } }
                    style={ {
                      width: 150, height: 150, borderRadius: 150, alignSelf: 'center',
                    } }
                  />
                  ) }
                  <View style={ {
                    flex: 1, flexDirection: 'row', alignSelf: 'center',
                  } }
                  >
                    <Menu
                      visible={ visible }
                      style={ { marginTop: 40, marginLeft: 70 } }
                      anchor={ <Button onPress={ showMenu } title='upload Image' /> }
                      onRequestClose={ hideMenu }
                    >
                      <MenuItem onPress={ galleryImageUpload } style={ { alignItems: 'center' } }>Gallery</MenuItem>
                      <MenuItem onPress={ cameraImageUpload } style={ { alignItems: 'center' } }>Camera</MenuItem>
                    </Menu>
                  </View>
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='firstName'
                    autoCapitalize='none'
                    autoCorrect={ false }
                    label={ strings('Labels.firstName') }
                  />
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='lastName'
                    autoCapitalize='none'
                    autoCorrect={ false }
                    label={ strings('Labels.lastName') }
                  />
                  <RadioButton
                    name='gender'
                    Data={ genderData }
                    initial={ 1 }
                    selectedBtn={ e => setGenderSelect(e.value) }
                    box={ false }
                    circleSize={ 11 }
                  />
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='mobile'
                    autoCapitalize='none'
                    autoCorrect={ false }
                    label={ strings('Labels.phoneNumber') }
                  />
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='email'
                    autoCapitalize='none'
                    autoCorrect={ false }
                    label={ strings('Labels.email') }
                  />
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='createPassword'
                    autoCapitalize='none'
                    rightIcon={ (
                      <Icon
                        type='ionicon'
                        name={ hidePassword ? 'eye' : 'eye-off' }
                        size={ 24 }
                        color='black'
                        onPress={ () => setHidePassword(!hidePassword) }
                      />
                    ) }
                    autoCorrect={ false }
                    secureTextEntry={ !!hidePassword }
                    label={ strings('Labels.createPassword') }
                  />
                  <Field
                    inputStyle={ styles.textInput }
                    placeholder={ strings('Placehoders.typeHere') }
                    component={ URTextfield }
                    name='confirmPassword'
                    autoCapitalize='none'
                    rightIcon={ (
                      <Icon
                        type='ionicon'
                        name={ hideConfirmPassword ? 'eye' : 'eye-off' }
                        size={ 24 }
                        color='black'
                        onPress={ () => setHideConfirmPassword(!hideConfirmPassword) }
                      />
                    ) }
                    autoCorrect={ false }
                    secureTextEntry={ !!hideConfirmPassword }
                    label={ strings('Labels.confirmPassword') }
                  />
                  <Button
                    onPress={ handleSubmit }
                    title={ strings('General.signup') }
                    disabled={ !isValid }
                  />
                </>
              ) }
            </Formik>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

