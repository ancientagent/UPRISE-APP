import { StyleSheet, Platform } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  loginBtnStyle: {
    fontSize: 15,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.Black,
  },
  container: {
    marginBottom: 45,
  },
  inputBox: {
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '85%',
  },
  upriseRadiyoIcon: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  loginBtn: {
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
  signUpText: {
    fontFamily: 'Oswald Regular',
    fontSize: 15,
    fontWeight: '400',
    color: Colors.URbtnColor,
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  forgotText: {
    fontFamily: 'Oswald Regular',
    top: 18,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.labelColor,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  googleBtnView: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.URbtnColor,
    marginBottom: 14,
  },
  googleText: {
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 14,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Platform.OS === 'android' ? 346 : 333,
    justifyContent: 'center',
    height: 50,
  },
});
