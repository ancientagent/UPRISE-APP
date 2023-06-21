import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  FavoritesTabView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  ImageViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 50,
    width: 50,
    marginRight: 20,
  },
  titleStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.White,
    marginBottom: 7,
  },
  subText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.White,
  },
  FavoritesViewStyle: {
    marginTop: 28,
    height: '93%',
  },
  songsText: {
    alignSelf: 'center',
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 16,
    color: Colors.sideHeadingText,
  },
});
