import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  PlayerSkeltonContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    width: '80%',
    flexDirection: 'row',
  },
  skeltonBox1: {
    backgroundColor: Colors.labelBgColor,
    height: 20,
    width: '70%',
    borderRadius: 8,
  },
  skeltonBox2: {
    backgroundColor: Colors.labelBgColor,
    height: 20,
    width: '30%',
    marginLeft: 15,
    borderRadius: 8,
  },
  skeltonBox3: {
    backgroundColor: Colors.labelBgColor,
    height: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  songLoader: {
    height: 28,
    width: 30,
    marginRight: 15,
  },
  miniPlayerView: {
    flexDirection: 'row',
    marginRight: 24,
    marginTop: 10,
  },
  songImage: {
    height: 75,
    width: 67,
    alignSelf: 'center',
  },
  songDetailsTextView: {
    flexDirection: 'column',
    width: '82%',
  },
  songDetailsText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  songName: {
    fontSize: 18,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.labelColor,
    lineHeight: 24.62,
  },
  artistName: {
    marginTop: 2,
    color: Colors.playerArtistNameColor,
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  sliderView: {
    flexDirection: 'column',
    left: 8,
  },
  sliderStyle: {
    width: '97%',
    height: 20,
  },
  trackStyle: {
    borderRadius: 0,
    height: 2,
  },
  thumbStyle: {
    height: 8,
    width: 8,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.URbtnColor,
  },
  timeTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '96%',
  },
});

