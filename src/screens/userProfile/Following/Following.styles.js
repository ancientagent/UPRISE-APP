import { Platform, StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  FollowingViewStyle: {
    height: Platform.OS === 'ios' ? '87%' : '86%',
    justifyContent: 'space-between',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  focusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.URbtnColor,
  },
  unfocusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.sideHeadingText,
  },
});
