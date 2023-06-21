import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  containerStyle: { borderRadius: 0, width: '85%' },
  textInputProps: {
    color: Colors.textColor,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    placeholderTextColor: Colors.textColor,
  },
  hintText: {
    color: Colors.textColor,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 11,
    marginBottom: 20,
  },
  stylesInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.textColor,
  },
  stylesContainer: {
    position: 'relative',
    margin: 0,
    width: '85%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: 24,
  },
  stylesItemText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 12,
    color: Colors.labelColor,
  },
  stylesList: {
    marginTop: 5,
    backgroundColor: Colors.eventViewBgColor,
  },
  locationContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  locationIcon: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  detectText: {
    marginBottom: 6,
    fontSize: 22,
    color: Colors.labelColor,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
  },
  welcomeText: {
    color: Colors.labelColor,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 16,
    marginBottom: 4,
  },
  detectbtn: {
    backgroundColor: Colors.URbtnColor,
    width: '100%',
    marginBottom: 26,
    borderRadius: 0,
  },
  btnTitle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },

});
