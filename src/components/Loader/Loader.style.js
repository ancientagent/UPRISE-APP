import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.modelBgColor,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loadingText: {
    color: Colors.White,
    marginTop: 20,
  },
});
