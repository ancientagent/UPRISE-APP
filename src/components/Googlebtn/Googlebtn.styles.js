import { StyleSheet, Platform } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  googleBtnView: {
    height: 50,
    width: '100%',
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
    alignSelf: 'center',
    width: Platform.OS === 'android' ? 346 : 333,
    justifyContent: 'center',
    height: 50,
  },
});
