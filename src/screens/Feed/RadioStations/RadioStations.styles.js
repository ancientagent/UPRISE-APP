import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  stateName: {
    fontFamily: 'Oswald Bold',
    fontWeight: '800',
    fontSize: 32,
    marginLeft: 24,
    color: Colors.labelColor,
    marginTop: 40,
    maxWidth: 200,
  },
  overlayer: {
    position: 'absolute',
  },
  bgImgStyle: {
    height: 252,
    width: '100%',
  },
  iconPosition: {
    backgroundColor: Colors.AlbumOpacityLayerColor,
    height: 252,
    width: '100%',
    flexDirection: 'row',
  },
  iconStyle: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginLeft: 24,
  },
  songView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  AlbumNameView: {
    flexDirection: 'row',
  },
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  songImgView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImg: {
    height: 73,
    width: 70,
    marginRight: 20,
  },
  songTitle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.White,
    marginBottom: 7,
  },
  timeText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 12,
    color: Colors.sideHeadingText,
  },
  contentView: {
    height: '94%',
    justifyContent: 'space-between',
  },
  albumView: {
    marginBottom: 20,
    marginHorizontal: 24,
  },
  albumTitle: {
    fontSize: 24,
    marginTop: 15,
    fontFamily: 'Oswald Bold',
    fontWeight: '800',
    color: Colors.labelColor,
  },
  albumSubText: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.AlbumSubTxtColor,
  },
});
