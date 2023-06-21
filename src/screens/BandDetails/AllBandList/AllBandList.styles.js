import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  bandListView: {
    height: Platform.OS === 'ios' ? '87%' : '85%',
    justifyContent: 'space-between',
  },
  gridView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bandImageView: {
    width: 160,
  },
  bandListContainer: {
    height: '85%',
    marginHorizontal: 10,
  },
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  bandText: {
    color: Colors.White,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  bandImage: {
    height: 148,
    width: 160,
  },
});
