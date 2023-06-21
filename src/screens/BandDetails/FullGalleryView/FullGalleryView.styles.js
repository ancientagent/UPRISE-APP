import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  fullGalleryView: {
    height: Platform.OS === 'ios' ? '87%' : '85%',
    justifyContent: 'space-between',
  },
  fullGalleryContainer: {
    height: '85%',
  },
  modelStyle: { backgroundColor: Colors.Black, height: '100%' },
  iconStyle: { marginTop: 50, alignSelf: 'flex-end' },
  imageView: {
    height: 500, width: '100%', marginTop: 100,
  },
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  gridView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gridImage: {
    height: 105,
    width: 158,
  },
});
