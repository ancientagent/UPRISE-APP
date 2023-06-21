import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  ItemViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 13,
  },
  ImageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ImageStyle: {
    height: 40,
    width: 40,
    marginRight: 20,
    borderRadius: 40,
  },
  titleStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 18,
    color: Colors.White,
  },
  unfollowtxt: {
    color: Colors.radiumColour,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
  },
  containerStyle: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    height: 40,
  },
  inputContainerStyle: {
    backgroundColor: Colors.searchBarBgColor,
    height: 40,
    paddingHorizontal: 3,
  },
  searchIconStyle: {
    size: 20,
    color: Colors.White,
  },
  followStyle: {
    textAlign: 'center',
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 16,
    marginTop: 30,
    color: Colors.sideHeadingText,
  },
});
