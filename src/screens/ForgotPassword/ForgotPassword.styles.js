import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  buttonStyle: {
    backgroundColor: Colors.eventNameTextColor,
    width: '100%',
    borderRadius: 0,
  },
  containerStyle: {
    borderRadius: 0,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  ImageStyle: { height: 100, width: 100, marginBottom: 30 },
  container: {
    justifyContent: 'center', alignItems: 'center', marginTop: 30,
  },
  forgotPasswordTxt: {
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
});
