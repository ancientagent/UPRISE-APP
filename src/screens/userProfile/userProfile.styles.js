import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  homeContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  userProfileView: {
    justifyContent: 'space-between',
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: '70%',
    alignItems: 'center',
  },
  profileImage: {
    height: 25,
    width: 25,
    backgroundColor: Colors.iconBgColor,
    marginLeft: '5%',
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
  conatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  miniPlayerStyle: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  focusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 120,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.URbtnColor,
  },
  unfocusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 120,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.sideHeadingText,
  },
});
