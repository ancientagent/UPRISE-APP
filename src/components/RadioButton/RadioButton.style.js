import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  label: {
    marginLeft: 2,
    fontSize: 16,
    color: Colors.White,
  },
  textStyle: {
    marginLeft: 10,
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 14,
  },
  radioButtonStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 25,
    alignItems: 'center',
    width: '30%',
  },
});
