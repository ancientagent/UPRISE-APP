import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  AllAlbumsView: {
    height: Platform.OS === 'ios' ? '87%' : '85%',
    justifyContent: 'space-between',
  },
  AllAlbumsContainer: {
    height: '85%',
  },
  gridView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  albumsImageView: {
    width: 160,
  },
  albumsImage: {
    height: 148,
    width: 160,
  },
  albumsTextStyle: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
    width: '90%',
  },
  AlbumNameView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  AlbumTitle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.AlbumTitleColor,
  },
});
