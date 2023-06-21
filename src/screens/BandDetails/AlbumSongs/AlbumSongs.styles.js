import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  songView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
    height: 50,
    width: 50,
    marginRight: 20,
  },
  songTitle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    color: Colors.White,
    marginBottom: 7,
  },
  songSubText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '400',
    fontSize: 12,
    color: Colors.White,
  },
  timeText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 12,
    color: Colors.sideHeadingText,
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
    marginTop: 40,
    alignSelf: 'flex-start',
    marginHorizontal: 24,
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
    fontSize: 14,
    color: Colors.AlbumSubTxtColor,
  },
});
