import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import radioStations from '../../../assets/images/radio_stations.svg';
import styles from './SliderEntry.style';
import Colors from '../../theme/colors';
import SvgImage from '../SvgImage/SvgImage';

const SliderEntry = props => {
  const image = () => {
    const {
      uri, parallax, parallaxProps, even, defultImage,
    } = props;

    return parallax ? (
      <ParallaxImage
        source={ uri ? { uri } : defultImage }
        containerStyle={ [styles.imageContainer, even ? styles.imageContainerEven : {}] }
        style={ styles.image }
        parallaxFactor={ 0.35 }
        showSpinner
        spinnerColor={ Colors.White }
        // eslint-disable-next-line react/jsx-props-no-spreading
        { ...parallaxProps }
      />
    ) : (
      <Image
        source={ { uri } }
        style={ styles.image }
      />
    );
  };
  const {
    even, onDone, title, bgColor, showRadioStation,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={ 1 }
      style={ showRadioStation ? styles.radioSlideInnerContainer : styles.slideInnerContainer }
      onPress={ onDone }
    >
      <>
        <View style={ [styles.imageContainer, even ? styles.imageContainerEven : {}] }>
          { showRadioStation ? (
            <SvgImage
              iconName={ radioStations }
              iconStyle={ {
                backgroundColor: bgColor,
                width: 207,
                marginRight: 15,
              } }
              width={ 207 }
              height={ 200 }
            />
          ) : image() }
        </View>
        <Text style={ showRadioStation ? styles.titleStyle1 : styles.titleStyle2 }>
          { title }
        </Text>
      </>
    </TouchableOpacity>
  );
};

export default SliderEntry;
