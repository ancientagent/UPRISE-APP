/* eslint-disable global-require */
import React from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import styles from './mailConfirmation.styles';
import { strings } from '../../utilities/localization/localization';
import URContainer from '../../components/URContainer/URContainer';

const MailConfirmation = props => {
  const { navigation, route } = props;
  const isfromSignup = route.params.showData;
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <View style={ styles.container }>
        <Image
          style={ styles.ImageStyle }
          source={ require('../../../assets/images/email_confirmation_icon.png') }
        />
        <Text style={ styles.mailConfirmationTxt }>{ isfromSignup ? strings('mailConfirmation.Email') : strings('mailVlidation.thanks') }</Text>
        <Text style={ styles.mailConfirmationTxt }>{ isfromSignup ? strings('mailConfirmation.success') : strings('mailVlidation.withUprise') }</Text>
        <Text style={ styles.subTxt }>{ isfromSignup ? strings('mailConfirmation.linkSent') : strings('mailVlidation.verifyTxt') }</Text>
        <Text style={ styles.subTxt }>{ isfromSignup ? strings('mailConfirmation.resetPassword') : strings('mailVlidation.account') }</Text>
        <Button
          buttonStyle={ styles.loginBtn }
          TouchableComponent={ TouchableOpacity }
          titleStyle={ styles.loginBtnStyle }
          onPress={ () => navigation.navigate('Login') }
          title={ strings('General.login') }
        />
        { isfromSignup && (
        <View style={ styles.signUpContainer }>
          <Text style={ styles.accountText }>{ strings('mailConfirmation.recieveLink') }</Text>
          <TouchableOpacity onPress={ () => navigation.navigate('ForgotPassword') }>
            <Text style={ styles.signUpText }>{ strings('mailConfirmation.resend') }</Text>
          </TouchableOpacity>
        </View>
        ) }
      </View>
    </URContainer>
  );
};
export default MailConfirmation;
