import {StyleSheet} from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  songLoader: {
    height: 32,
    width: 32,
  },
  Container: {
    marginTop: 12,
    width: '80%',
  },
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
  thumbStyle: {maxHeight: 16, maxWidth: 16},
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  locationView: {
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.labelColor,
  },
  // Tier Toggle Styles
  tierToggleContainer: {
    width: '90%',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tierToggleTitle: {
    fontSize: 16,
    fontFamily: 'Oswald Bold',
    fontWeight: '700',
    color: Colors.White,
    textAlign: 'center',
    marginBottom: 12,
  },
  tierButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tierButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  tierButtonActive: {
    backgroundColor: Colors.URbtnColor,
    borderColor: Colors.URbtnColor,
  },
  tierButtonText: {
    fontSize: 12,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.White,
  },
  tierButtonTextActive: {
    color: Colors.Black,
    fontWeight: '600',
  },
  tierDescription: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.White,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
});
