import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  iconContainer: {
    maxWidth: 0,
    right: 8,
    padding: 0,
    paddingRight: 10,
  },
  inputBox: {
    marginBottom: 9,
  },
  container: {
    marginBottom: 45,
  },
  upriseRadiyoIcon: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  signupContainer: {
    width: '85%', marginTop: 80, alignItems: 'center',
  },
  checkText: {
    color: Colors.White,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
  },
  highlightedText: {
    color: Colors.URbtnColor,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    textDecorationLine: 'underline',
    fontSize: 14,
    lineHeight: 16,
  },
  signupTitle: {
    fontSize: 15,
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    color: Colors.Black,
  },
  signupBtn: {
    activeOpacity: 0.7,
    backgroundColor: Colors.URbtnColor,
    width: 121,
    borderRadius: 50,
    alignSelf: 'center',
  },
  signUpContainer: {
    top: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  accountText: {
    fontFamily: 'Oswald Regular',
    top: 1,
    fontSize: 15,
    color: Colors.labelColor,
    fontWeight: '400',
  },
  loginText: {
    fontFamily: 'Oswald Regular',
    fontSize: 15,
    fontWeight: '400',
    color: Colors.URbtnColor,
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  SignupUserNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  SignupUserNameHeadingView: {
    alignSelf: 'flex-start',
    marginHorizontal: '7%',
    top: 20,
  },
  SignupUserNameHeading: {
    color: Colors.labelColor,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Oswald Bold',
    fontWeight: '900',
  },
  SignupUserNameIndicationText: {
    marginTop: 8,
    color: Colors.labelColor,
    fontSize: 14,
    lineHeight: 19.12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
  },
  SignupUserNameField: { marginTop: 40, width: '85%' },
  titleStyle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.Black,
  },
  containerStyle: {
    borderRadius: 0,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: Colors.URbtnColor,
    borderRadius: 0,
  },
  socialButtonPlaceholder: {
    backgroundColor: Colors.White,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.URbtnColor,
  },
  placeholderText: {
    color: Colors.URbtnColor,
    fontFamily: 'Oswald Regular',
    fontSize: 16,
    fontWeight: '500',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  pageDotActive: {
    backgroundColor: Colors.URbtnColor,
  },
  pageDotInactive: {
    backgroundColor: Colors.labelColor,
  },
  pageTitle: {
    color: Colors.labelColor,
    fontSize: 24,
    fontFamily: 'Oswald Bold',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: Colors.labelColor,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontWeight: '500',
    marginBottom: 8,
  },
  genreDropdown: {
    backgroundColor: Colors.White,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.URbtnColor,
  },
  genreText: {
    color: Colors.Black,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
  },
  genrePlaceholder: {
    color: Colors.labelColor,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontStyle: 'italic',
  },
  genreDropdownList: {
    backgroundColor: Colors.White,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.URbtnColor,
  },
  genreOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.labelColor + '20',
  },
  genreOptionText: {
    color: Colors.Black,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
  },
  // Styles for single-page signup form
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.White,
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.URbtnColor,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.labelColor + '20',
  },
  suggestionText: {
    color: Colors.Black,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxLabel: {
    color: Colors.White,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    marginLeft: 10,
    flex: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    marginTop: 4,
  },
});
