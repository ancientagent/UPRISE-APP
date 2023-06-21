import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  bandName: {
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
    color: Colors.eventDetailsTextColor,
  },
  containtView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bandNameHeadeing: {
    color: Colors.eventNameTextColor,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 16,
  },
  calendarBtnText: {
    marginHorizontal: 14,
    marginVertical: 4,
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 10,
  },
  calendarBtnView: {
    backgroundColor: Colors.calendarBtnBg,
    borderRadius: 20,
    top: 8,
  },
  addCalendarBtnText: {
    marginVertical: 4,
    marginLeft: 3,
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 10,
  },
  eventTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyTxt: {
    color: Colors.White,
    textAlign: 'center',
    marginVertical: 24,
  },
  eventView: {
    marginHorizontal: 24,
    backgroundColor: Colors.eventViewBgColor,
    paddingBottom: 15,
    marginBottom: 25,
    borderRadius: 4,
  },
  eventText: {
    width: '65%',
    marginTop: 12,
    fontWeight: '800',
    fontFamily: 'Oswald Bold',
    fontSize: 24,
    color: Colors.labelColor,
  },
  eventDetailsTextView: {
    marginTop: 6,
    flexDirection: 'row',
  },
  eventImage: {
    height: 145,
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  eventDetailsText: {
    color: Colors.eventDetailsTextColor,
    left: 8,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
  },
  bandText: {
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
    color: Colors.eventDetailsTextColor,
  },
  bandSubText: {
    marginTop: 6,
    color: Colors.eventDetailsTextColor,
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 16,
  },
});
