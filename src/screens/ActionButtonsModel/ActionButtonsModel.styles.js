import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  containerStyle: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  skipBlastBtnSet: {
    containerStyle: {
      flexDirection: 'row', marginBottom: 10, width: '35%', alignSelf: 'center',
    },
    leftTextStyle: { color: Colors.labelColor, alignSelf: 'center', right: 4 },
    leftBtnStyle: { marginRight: 15 },
    rightTextStyle: { color: Colors.labelColor, alignSelf: 'center', left: 4 },
  },
  reportFollowBtnSet: {
    containerStyle: {
      flexDirection: 'row', marginBottom: 10, width: '62%', alignSelf: 'center',
    },
    leftTextStyle: { color: Colors.labelColor, alignSelf: 'center', right: 4 },
    rightTextStyle: { color: Colors.labelColor, alignSelf: 'center', left: 4 },
    leftBtnStyle: { marginRight: 81 },
  },
  downUpvoteBtnSet: {
    containerStyle: {
      flexDirection: 'row', width: '80%', alignSelf: 'center', marginBottom: 10,
    },
    leftTextStyle: { color: Colors.labelColor, alignSelf: 'center', right: 4 },
    leftBtnStyle: { marginRight: 120 },
    rightTextStyle: { color: Colors.labelColor, alignSelf: 'center', left: 4 },
  },
});
