import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
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
  profileImage: {
    height: 25,
    width: 25,
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
  },
  locationText: {
    marginLeft: 7,
    fontSize: 14,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.labelColor,
    lineHeight: 19.12,
  },
  generBtnContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 14,
    flexWrap: 'wrap',
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
    lineHeight: 16.39,
    marginHorizontal: 24,
    marginVertical: 5,
  },
});
