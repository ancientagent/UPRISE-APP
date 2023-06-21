import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';

export default StyleSheet.create({
  galleryTabView: { marginTop: 15 },
  gridView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gridImage: {
    height: 105,
    width: 158,
  },
  modelStyle: {
    backgroundColor: Colors.Black,
    height: '100%',
  },
  iconStyle:
      {
        marginTop: 50,
        alignSelf: 'flex-end',
      },
  galleryTxt: {
    alignSelf: 'center',
    fontSize: 12,
    color: Colors.sideHeadingText,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  seeMoreText: {
    color: Colors.URbtnColor,
    alignSelf: 'center',
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
  },
  imageViewStyle: {
    height: 500,
    width: '100%',
    marginTop: 100,
  },
});
