/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, TouchableOpacity, ImageBackground,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
// import SvgImage from '../../../components/SvgImage/SvgImage';
import styles from '../DiscoveyPage.styles';
import {
  getMostPopularGenresList,
} from '../../../state/selectors/UserProfile';
// import musicVector from '../../../../assets/images/musicVector.svg';
import Loader from '../../../components/Loader/Loader';

const AllPopularGenres = props => {
  const { navigation } = props;
  const genresList = useSelector(getMostPopularGenresList);

  const showLoading = useSelector(state => state.mostPopularGenres.isWaiting);
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />

      <View style={ styles.AllAlbumsView }>
        <View style={ styles.AllAlbumsContainer }>
          <FlatGrid
            itemContainerStyle={ styles.gridView }
            maxItemsPerRow={ 2 }
            data={ genresList }
            key={ item => item.id }
            renderItem={ ({ item }) => (
              <TouchableOpacity
                activeOpacity={ 0.8 }
                onPress={ () => {
                  navigation.navigate('RadioStations', { genreId: item.id, genreName: item.name, isDiscovery: true });
                } }
              >
                <View style={ styles.genreImageView }>
                  <ImageBackground
                    style={ styles.genreImage }
                    source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                  >
                    <View style={ styles.genreOverlay }>
                      <Text style={ styles.genreTextStyle }>
                        { item.name }
                      </Text>
                      { /* <View style={ styles.genreNameView }>
                        <SvgImage iconStyle={ { right: 4 } } iconName={ musicVector } height={ 10 } width={ 6 } />
                        <Text style={ styles.genreTitle }>
                          { item.songCount }
                          { ' ' }
                          Tracks
                        </Text>
                      </View> */ }
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default AllPopularGenres;
