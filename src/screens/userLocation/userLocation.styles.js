import {StyleSheet} from 'react-native';
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  placesContainer: {
    marginTop: 80,
  },
  btnStyle: {
    marginTop: 20,
  },
  btn: {
    backgroundColor: Colors.green,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  btntext: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  btntextDisabled: {
    color: '#999',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    color: Colors.textColor,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    marginBottom: 8,
  },
  detectLocationBtn: {
    backgroundColor: Colors.green,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detectLocationText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
  },
  inputWrapper: {
    marginBottom: 25,
    position: 'relative',
  },
  textInput: {
    height: 50,
    borderColor: Colors.textColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    color: Colors.White,
    fontSize: 14,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    borderColor: 'grey',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 14,
  },
  selectedItem: {
    backgroundColor: Colors.green,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
  },
});

export default styles;
