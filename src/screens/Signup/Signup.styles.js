import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  iconContainer: {
    maxWidth: 0,
    right: 8,
    padding: 0,
    paddingRight: 10,
  },
  inputBox: {
    marginBottom: 9,
  },
  container: {
    marginBottom: 45,
  },
  upriseRadiyoIcon: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  signupContainer: {
    width: '85%', marginTop: 80, alignItems: 'center',
  },
  checkText: {
    color: Colors.White,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
  },
  highlightedText: {
    color: Colors.URbtnColor,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    textDecorationLine: 'underline',
    fontSize: 14,
    lineHeight: 16,
  },
  signupTitle: {
    fontSize: 15,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.Black,
  },
  signupBtn: {
    activeOpacity: 0.7,
    backgroundColor: Colors.URbtnColor,
    width: 121,
    borderRadius: 50,
    alignSelf: 'center',
  },
  signUpContainer: {
    top: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  accountText: {
    fontFamily: 'Oswald Regular',
    top: 1,
    fontSize: 15,
    color: Colors.labelColor,
    fontWeight: '400',
  },
  loginText: {
    fontFamily: 'Oswald Regular',
    fontSize: 15,
    fontWeight: '400',
    color: Colors.URbtnColor,
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  SignupUserNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  SignupUserNameHeadingView: {
    alignSelf: 'flex-start',
    marginHorizontal: '7%',
    top: 20,
  },
  SignupUserNameHeading: {
    color: Colors.labelColor,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
  },
  SignupUserNameIndicationText: {
    marginTop: 8,
    color: Colors.labelColor,
    fontSize: 14,
    lineHeight: 19.12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  SignupUserNameField: { marginTop: 40, width: '85%' },
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  containerStyle: {
    borderRadius: 0,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: Colors.URbtnColor,
    borderRadius: 0,
  },
});
