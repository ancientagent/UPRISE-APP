import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  updatePasswordContainer: {
    width: '85%',
    marginTop: 30,
    alignSelf: 'center',
  },
  inputBox: {
    marginBottom: 9,
  },
  updatePasswordStyle: {
    fontSize: 15,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.Black,
  },
  cancelStyle: {
    fontSize: 15,
    alignSelf: 'center',
    color: Colors.radiumColour,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  updatePassword: {
    marginVertical: 25,
    backgroundColor: Colors.URbtnColor,
    width: 121,
    borderRadius: 50,
    alignSelf: 'center',
  },
});
