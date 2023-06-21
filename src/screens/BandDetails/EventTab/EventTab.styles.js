import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  eventTxt: {
    alignSelf: 'center',
    fontSize: 12,
    color: Colors.sideHeadingText,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  galleryTabView: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  gridView: { marginBottom: 10 },
  gridImage: {
    height: 164,
    width: '100%',
  },
  textStyle: {
    color: Colors.White,
    marginTop: 6,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
  eventDetailsTextView: {
    marginTop: 6,
    flexDirection: 'row',
  },
  seeMoreText: {
    color: Colors.URbtnColor,
    alignSelf: 'center',
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
  },
  eventDetailsText: {
    color: Colors.eventDetailsTextColor,
    left: 8,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
});
