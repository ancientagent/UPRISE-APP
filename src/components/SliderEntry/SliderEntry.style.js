import { StyleSheet, Dimensions, Platform } from 'react-native';
import Colors from '../../theme/colors';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(60);
const itemHorizontalMargin = wp(1);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 4;

export default StyleSheet.create({
  titleStyle1: {
    width: 207,
    height: 40,
    textAlign: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
    top: 150,
    position: 'absolute',
  },
  titleStyle2: {
    width: 207,
    height: 40,
    textAlign: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
  },
  radioSlideInnerContainer: {
    width: itemWidth,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
    marginBottom: 10,
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: Colors.Black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'transparent',
    borderRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: 'transparent',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    maxHeight: 207,
    maxWidth: 207,
    borderRadius: entryBorderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: Colors.White,
  },
  radiusMaskEven: {
    backgroundColor: Colors.Black,
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.White,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  textContainerEven: {
    backgroundColor: Colors.Black,
  },
  title: {
    color: Colors.Black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  titleEven: {
    color: Colors.White,
  },
  subtitle: {
    marginTop: 6,
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic',
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
