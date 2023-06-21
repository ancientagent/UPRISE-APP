import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  songLoader: {
    height: 32, width: 32,
  },
  Container: {
    marginTop: 60,
    marginHorizontal: 40,
  },
  thumbStyle: { maxHeight: 16, maxWidth: 16 },
  playerImage: {
    height: 266,
    width: '100%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  songTitle: {
    fontSize: 18,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
    color: Colors.labelColor,
  },
  songArtistText: {
    color: Colors.playerArtistNameColor,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  songTimeStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.URbtnColor,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 45,
    width: 160,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
