import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    marginRight: 15,
    marginBottom: 12,
  },
  contentView: {
    marginHorizontal: 24,
    justifyContent: 'space-between',
    height: '98%',
  },
  chipsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genrText: {
    marginHorizontal: 8,
    color: Colors.labelColor,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
  chipBtnStyle: {
    borderWidth: 1,
    padding: 5,
  },
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  buttonStyle: {
    backgroundColor: Colors.eventNameTextColor,
    width: '100%',
    borderRadius: 0,
  },
  containerStyle: {
    borderRadius: 0,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  selectText: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
    marginBottom: 30,
    color: Colors.labelColor,
  },
});

