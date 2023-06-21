/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import SvgImage from '../../components/SvgImage/SvgImage';
import styles from './WelcomeScreen.styles';
import { strings } from '../../utilities/localization/localization';
import URContainer from '../../components/URContainer/URContainer';
import ArrowRight from '../../../assets/images/arrow_right.svg';

const slides = [
  {
    key: 1,
    title: strings('WelcomeScreen.stepOneTitile'),
    text: strings('WelcomeScreen.stepOneText'),
    image: require('../../../assets/images/stepOne.png'),
    width: 171,
    height: 175,
  },
  {
    key: 2,
    title: strings('WelcomeScreen.stepTwoTitile'),
    text: strings('WelcomeScreen.stepTwoText'),
    image: require('../../../assets/images/stepTwo.png'),
    width: 171,
    height: 171,
  },
];
const WelcomeScreenSlides = props => {
  const [currentPage, setCurrentPage] = useState(0);
  const renderSlide = item => (
    <View style={ styles.renderItemContainer }>
      <Image
        style={ { width: item.width, height: item.height, marginBottom: 82 } }
        source={ item.image }
      />
      <Text style={ styles.title }>{ item.title }</Text>
      <Text style={ styles.text }>{ item.text }</Text>
    </View>
  );
  const renderPaginationDots = index => (
    <View style={ [styles.paginationWrapper] }>
      <View style={ index === 0 ? styles.activeDot : styles.inactiveDot } />
      <View style={ index === 1 ? styles.activeDot : styles.inactiveDot } />
    </View>
  );
  const renderSkipButton = () => {
    const { onDone } = props;
    return (
      <View style={ styles.skipButton }>
        <TouchableOpacity onPress={ onDone }>
          <View style={ styles.skipContainer }>
            <Text style={ styles.skipText }>
              { strings('WelcomeScreen.skip') }
            </Text>
            <SvgImage iconName={ ArrowRight } width={ 29 } height={ 9 } iconStyle={ styles.arrowRight } />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const renderLetsGetStartedButton = () => {
    const { onDone } = props;
    return (
      <View style={ styles.skipButton }>
        <TouchableOpacity onPress={ onDone }>
          <View style={ styles.skipContainer }>
            <Text style={ styles.skipText }>
              { strings('WelcomeScreen.letsGetStarted') }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <URContainer safeAreaViewStyle={ { flex: 1 } }>
      <View style={ { flex: 1 } }>
        <Swiper
          style={ styles.swipeContainer }
          horizontal
          renderPagination={ renderPaginationDots }
          loop={ false }
          autoplay
          autoplayTimeout={ 2.5 }
          onIndexChanged={ index => setCurrentPage(index) }
        >
          { renderSlide(slides[0]) }
          { renderSlide(slides[1]) }
        </Swiper>
        { currentPage !== (slides.length - 1) ? renderSkipButton() : renderLetsGetStartedButton() }
      </View>
    </URContainer>
  );
};
export default WelcomeScreenSlides;
