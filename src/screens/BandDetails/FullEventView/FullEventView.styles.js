import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  fullEventView: {
    height: Platform.OS === 'ios' ? '87%' : '85%',
    justifyContent: 'space-between',
  },
  fullEventContainer: {
    height: '85%',
    marginHorizontal: 10,
  },
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  gridView: {
    marginBottom: 10,
  },
  gridImage: {
    height: 164,
    width: '100%',
  },
  textStyle: {
    color: Colors.White,
    marginTop: 6,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
  eventDetailsTextView: {
    marginTop: 6,
    flexDirection: 'row',
  },
  eventDetailsText: {
    color: Colors.eventDetailsTextColor,
    left: 8,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
});
