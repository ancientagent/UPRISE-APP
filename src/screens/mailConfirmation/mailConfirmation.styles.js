import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  inputBox: {
    width: '88%',
  },
  buttonStyle: {
    backgroundColor: Colors.eventNameTextColor,
    width: '100%',
    borderRadius: 0,
  },
  containerStyle: {
    borderRadius: 0,
    width: '88%',
    alignSelf: 'center',
    marginTop: 20,
  },
  ImageStyle: { height: 100, width: 100, marginBottom: 30 },
  container: {
    justifyContent: 'center', alignItems: 'center', marginTop: 30,
  },
  mailConfirmationTxt: {
    fontSize: 28,
    fontFamily: 'Oswald Bold',
    fontWeight: '800',
    color: Colors.labelColor,
  },
  subTxt: {
    fontSize: 14,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
  },
  loginBtn: {
    marginTop: 15,
    backgroundColor: Colors.URbtnColor,
    width: 121,
    borderRadius: 50,
    alignSelf: 'center',
  },
  loginBtnStyle: {
    fontSize: 15,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.Black,
  },
  signUpContainer: {
    marginTop: 20,
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
});
