import { StyleSheet, Platform } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  errorText: {
    fontFamily: 'Oswald Light',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '300',
    alignSelf: 'flex-start',
    color: Colors.errorTextColor,
  },
  textInput: {
    borderColor: Colors.textColor,
    borderWidth: 1,
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  inputText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    marginVertical: Platform.OS === 'ios' ? 4 : 0,
    color: Colors.labelColor,
  },
  asstricStyle: {
    color: Colors.URbtnColor,
    fontSize: 14,
    marginTop: 5,
  },
  label: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 15,
    color: Colors.labelColor,
  },
  errorInput: {
    borderColor: Colors.errorBorderColor,
  },
});

