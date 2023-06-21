import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  buttonStyle: {
    borderColor: 'transparent',
    borderRadius: 4,
    padding: 0,
    color: Colors.URbtnColor,
    backgroundColor: Colors.URbtnBgColor,
    marginRight: 10,
  },
  titleStyle: {
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
    paddingTop: 1,
    paddingBottom: 3,
    marginHorizontal: 10,
    color: Colors.radiumColour,
  },
  homeContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  marqueeTextStyle: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: '70%',
  },
  profileImage: {
    height: 25,
    width: 25,
    backgroundColor: Colors.iconBgColor,
    alignSelf: 'center',
    right: 7,
    borderColor: Colors.White,
    borderWidth: 0.56,
  },
  AvatarLetterStyle: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  profileText: {
    fontSize: 24,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
    color: Colors.labelColor,
    lineHeight: 32.78,
  },
  locationContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 14,
  },
  locationTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 7,
    fontSize: 14,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.labelColor,
  },
  generBtnContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 14,
    height: 40,
  },
  generBtnView: {
    height: 25,
    borderRadius: 4,
    backgroundColor: Colors.URbtnBgColor,
    marginBottom: 10,
    marginRight: 10,
  },
  generBtn: {
    fontSize: 14,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.URbtnColor,
    marginHorizontal: 14,
  },
});
