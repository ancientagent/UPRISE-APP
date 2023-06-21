import { StyleSheet, Platform } from 'react-native';
import Colors from '../theme/colors';

export default StyleSheet.create({
  reportModelContainer: {
    flex: 1,
    backgroundColor: Colors.blurModelColor,
  },
  reportModelView: {
    height: 290,
    top: 200,
    borderColor: Colors.textColor,
    borderWidth: 0.5,
    alignSelf: 'center',
    width: '85%',
    backgroundColor: Colors.popUpContainerColor,
  },
  reportText: {
    color: Colors.URbtnColor,
    fontSize: 20,
    alignSelf: 'center',
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
  },
  commentText: {
    marginTop: 15,
    fontSize: 14,
    alignSelf: 'flex-start',
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.White,
  },
  TextBoxContainer: {
    borderColor: Colors.textColor,
    borderWidth: 0.5,
    marginVertical: 10,
  },
  TextBoxView: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 13,
    margin: 2,
    marginHorizontal: 5,
    textAlignVertical: 'top',
    minHeight: 105,
    maxHeight: 105,
    lineHeight: 16,
    color: Colors.labelColor,
  },
  containerStyle: {
    borderRadius: 0,
    width: 100,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: Colors.URbtnColor,
    borderRadius: 0,
  },
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  tabBarBackgroundImg: {
    height: '100%',
    width: '100%',
  },
  homeIconStyle: {
    marginTop: Platform.OS === 'ios' ? 25 : 0,
    alignItems: 'center',
    marginLeft: 30,
  },
  discoveryIconStyle: {
    marginTop: Platform.OS === 'ios' ? 25 : 0,
    alignItems: 'center',
    marginRight: 30,
  },
  tabBarLabelStyle: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 10,
  },
  URNavigationButtonImg: {
    height: 60,
    width: 60,
  },
  URNavigationButtonStyle: {
    borderRadius: 60,
    borderColor: Colors.Black,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    position: 'absolute',
    borderTopWidth: 0,
    height: 70,
  },
});
