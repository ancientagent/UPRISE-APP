import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  calDotStyle: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  eventTxt: {
    color: Colors.White,
    fontFamily: 'Oswald Regular',
    alignSelf: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  location: {
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
    fontSize: 12,
    color: Colors.White,
  },
  eventName: {
    fontFamily: 'Oswald Bold',
    fontWeight: '800',
    fontSize: 16,
    color: Colors.White,
    marginBottom: 8,
  },
  timeTxtStyle: {
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
    fontSize: 12,
    color: Colors.sideHeadingText,
    marginLeft: 10,
  },
  dotStyle: {
    borderRadius: 9,
    height: 9,
    width: 9,
    backgroundColor: Colors.URbtnColor,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemContainerView: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  agendaContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    marginTop: 25,
    backgroundColor: Colors.eventViewBgColor,
    marginHorizontal: 25,
    borderRadius: 10,
    minHeight: 86,
  },
});
