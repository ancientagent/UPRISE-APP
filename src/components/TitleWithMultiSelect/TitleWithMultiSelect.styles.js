import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  styleTextDropdownSelected: {
    left: 10,
  },
  styleTextDropdown: {
    left: 10,
  },
  searchInputStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.textColor,
  },
  styleDropdownMenuSubsection: {
    borderColor: Colors.textColor,
    borderWidth: 1,
    height: 45,
    paddingRight: 0,
    backgroundColor: 'transparent',
  },
  styleItemsContainer: {
    height: 200,
    backgroundColor: Colors.dropDownColor,
  },
  styleMainWrapper: {
    marginHorizontal: 25,
    backgroundColor: 'transparent',
  },
  InputGroup: {
    height: 45,
    borderColor: Colors.textColor,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});
