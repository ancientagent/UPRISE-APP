import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  ArtistProfileView: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
  },
  ArtistLogo: {
    backgroundColor: Colors.URbtnColor,
    marginRight: 16,
  },
  artistNameView: {
    flex: 1,
    justifyContent: 'center',
  },
  artistNameText: {
    color: Colors.White,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: Colors.sideHeadingText,
    fontSize: 14,
    lineHeight: 20,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  promosView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  socialPlatform: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  socialPlatformTitle: {
    color: Colors.sideHeadingText,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  socialPlatformUserId: {
    color: Colors.White,
    fontSize: 14,
    marginBottom: 8,
  },
  editIconStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.URbtnColor,
    borderRadius: 10,
    padding: 4,
  },
  errorTextStyle: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  notArtistView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notArtistText: {
    color: Colors.sideHeadingText,
    fontSize: 16,
    textAlign: 'center',
  },
});
