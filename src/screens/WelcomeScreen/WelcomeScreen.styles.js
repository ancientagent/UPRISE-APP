import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  renderItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginEnd: 21,
    marginBottom: 35,
  },
  activeDot: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.URbtnColor,
    marginLeft: 20,
    marginStart: 20,
  },
  inactiveDot: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: 'transparent',
    borderWidth: 0.8,
    borderColor: Colors.URbtnColor,
    marginLeft: 20,
    marginStart: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Oswald Bold',
    color: Colors.White,
    marginBottom: 14,
  },
  text: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
    color: Colors.White,
  },
  swipeContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letsGetStartedInnerContainer: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    backgroundColor: Colors.URbtnColor,
    paddingHorizontal: 11,
    alignItems: 'center',
  },
  skipButton: {
    height: 35,
    paddingHorizontal: 15,
    marginBottom: 55,
    backgroundColor: Colors.URbtnColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 3,
  },
  arrowRight: {
    marginStart: 5,
  },
  skipContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
    color: Colors.Black,
  },
});
