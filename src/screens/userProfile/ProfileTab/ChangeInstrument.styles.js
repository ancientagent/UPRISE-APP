import { StyleSheet, Platform } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  ChooseTextStyle: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 14,
    marginLeft: 24,
    color: Colors.White,
    marginBottom: 20,
  },
  instrumentName: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 12,
    marginTop: 10,
    color: Colors.White,
  },
  AllAlbumsContainer: {
    height: Platform.OS === 'ios' ? '85%' : '90%',
    justifyContent: 'space-between',
  },
  gridView: {
    flexDirection: 'row',
  },
  memberImageView: {
    alignItems: 'center',
    marginRight: 28,
    width: 80,
    marginVertical: 10,
  },
  iconStyle: {
    height: 100,
    width: 100,
    borderWidth: 2,
    backgroundColor: Colors.iconBgColor,
    borderColor: Colors.White,
    borderRadius: 100,
    marginVertical: 20,
    alignSelf: 'center',
  },
  memberImageStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.iconBgColor,
  },
  ImageStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.iconBgColor,
  },
  selectedImageStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.iconBgColor,
    borderWidth: 0.8,
    borderColor: Colors.URbtnColor,
  },
  memberTextStyle: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 14,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
  },
  modelView: {
    marginVertical: 16,
    backgroundColor: Colors.URbtnColor,
    borderRadius: 20,
    width: 100,
    alignSelf: 'center',
  },
  closeBtn: {
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
    color: Colors.Black,
    marginVertical: 6,
    alignSelf: 'center',
  },
  miniPlayerStyle: {
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'flex-end',
  },
});
