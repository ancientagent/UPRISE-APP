/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, ImageBackground, Alert,
} from 'react-native';
import _ from 'lodash';
import TrackPlayer from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage
from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-virtualized-view';
import Carousel from 'react-native-snap-carousel';
import SliderEntry from '../../components/SliderEntry/SliderEntry';
import radioStations from '../../../assets/images/radio_stations.svg';
import { getStationBgColor } from '../../utilities/utilities';
import styles from './DiscoveyPage.styles';
import {
  getDiscoveryPopularBandsList, getTreandingSongsList, getMostPopularAlbumsList, getMostPopularGenresList,
  getRadioStations,
} from '../../state/selectors/UserProfile';
import {
  discoveryPopularBandsSagaAction,
  treandingSongsSagaAction,
  mostPopularAlbumsSagaAction,
  mostPopularGenresSagaAction,
} from '../../state/actions/sagas';
import albumVector from '../../../assets/images/albumVector.svg';
import bandVector from '../../../assets/images/bandVector.svg';
import SvgImage from '../../components/SvgImage/SvgImage';
import { sliderWidth, itemWidth } from '../../components/SliderEntry/SliderEntry.style';
// import musicVector from '../../../assets/images/musicVector.svg';
import { strings } from '../../utilities/localization/localization';
import { currentSongDataAction } from '../../state/actions/currentSongData/currentSongData.action';

const DiscoveyPage = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    const totalCount = {
      count: 'all',
    };
    dispatch(discoveryPopularBandsSagaAction(totalCount));
    dispatch(treandingSongsSagaAction(totalCount));
    // dispatch(mostPopularAlbumsSagaAction(totalCount));
    // dispatch(mostPopularGenresSagaAction(totalCount));
  }, []);
  const stateName = useSelector(getRadioStations);
  const popularBandsList = useSelector(getDiscoveryPopularBandsList);
  const treandingSongs = useSelector(getTreandingSongsList);
  const popularAlbums = useSelector(getMostPopularAlbumsList);
  const genresList = useSelector(getMostPopularGenresList);
  const formatedSongList = List => {
    const songDetails = _.map(List, data => {
      const url = data.song;
      const artist = _.get(data, 'band.title', '');
      const artwork = data.thumbnail;
      return {
        ...data, url, artwork, artist,
      };
    });
    return songDetails;
  };
  const renderAlbumsFlatList = renderData => (
    <View style={ { marginLeft: 20 } }>
      <FlatList
        horizontal
        data={ renderData }
        renderItem={ ({ item }) => (
          <TouchableOpacity
            activeOpacity={ 0.8 }
            onPress={ () => {
              navigation.navigate('AlbumSongs', { albumId: item.id, bandId: item.band.id });
            } }
          >
            <View style={ styles.albumsImageView }>
              <Image
                style={ styles.albumsImage }
                source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/album_default_img.png') }
              />
              <Text style={ styles.albumsTextStyle }>
                { item.title }
              </Text>
              <View style={ styles.AlbumNameView }>
                <SvgImage
                  iconName={ bandVector }
                  iconStyle={ { marginRight: 7 } }
                  width={ 12 }
                  height={ 12 }
                />
                <Text style={ styles.AlbumTitle }>{ item.band.title }</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) }
      />
    </View>
  );
  const renderGenresFlatList = renderData => (
    <View style={ { marginLeft: 20 } }>
      <FlatList
        horizontal
        data={ renderData }
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
                source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/music_default_img.png') }
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
  );
  const renderBandsFlatList = renderData => (
    <Carousel
      // ref={ c => _slider1Ref = c }
      data={ renderData }
      renderItem={ ({ item, index }, parallaxProps) => (
        <SliderEntry
          data={ item }
          even={ (index + 1) % 2 === 0 }
          parallax
          uri={ item.logo }
          title={ item.title }
          onDone={ () => navigation.navigate('BandDetails', { bandId: item.id }) }
          parallaxProps={ parallaxProps }
          defultImage={ require('../../../assets/images/band_defult_img.png') }
        />
      ) }
      sliderWidth={ sliderWidth }
      inactiveSlideShift={ 20 }
      itemWidth={ itemWidth }
      hasParallaxImages
      containerCustomStyle={ { marginTop: 15, overflow: 'visible' } }
    />
  );
  const renderRadioStations = () => {
    const colorsList = getStationBgColor;
    return (
      <View style={ styles.radioStaionView }>
        <Text style={ styles.radioStaion }>
          { strings('DiscoveyPage.popularRadioStation') }
        </Text>
        <Carousel
          // ref={ c => _slider1Ref = c }
          data={ stateName }
          renderItem={ ({ item, index }, parallaxProps) => (
            <SliderEntry
              data={ item }
              even={ (index + 1) % 2 === 0 }
              parallax
              showRadioStation
              title={ item }
              bgColor={ colorsList[index] }
              onDone={ () => navigation.navigate('RadioStations', {
                stateName: item,
                bgColor: colorsList[index],
              }) }
              parallaxProps={ parallaxProps }
            />
          ) }
          sliderWidth={ sliderWidth }
          inactiveSlideShift={ 20 }
          itemWidth={ itemWidth }
          hasParallaxImages
          containerCustomStyle={ { marginTop: 15, overflow: 'visible' } }
        />
        { /* <TouchableOpacity
          style={ {
            flexDirection: 'row',
          } }
          onPress={ () => {
            navigation.navigate('RadioStations', {
              stateName: item,
              bgColor: colorsList[index],
            });
          } }
        >
          <SvgImage
            iconName={ radioStations }
            iconStyle={ {
              backgroundColor: colorsList[index],
              width: 150,
              marginRight: 15,
            } }
            width={ 150 }
            height={ 145 }
          />
          <Text style={ styles.svgTxt }>
            { item }
          </Text>
        </TouchableOpacity> */ }
      </View>
    );
  };

  const renderTrendyFlatList = renderData => (
    <Carousel
      // ref={ c => _slider1Ref = c }
      data={ renderData }
      renderItem={ ({ item, index }, parallaxProps) => (
        <SliderEntry
          data={ item }
          even={ (index + 1) % 2 === 0 }
          parallax
          uri={ item.thumbnail }
          title={ item.title }
          onDone={ () => navOndemandPage(item) }
          parallaxProps={ parallaxProps }
          defultImage={ require('../../../assets/images/band_defult_img.png') }
        />
      ) }
      sliderWidth={ sliderWidth }
      inactiveSlideShift={ 20 }
      itemWidth={ itemWidth }
      hasParallaxImages
      containerCustomStyle={ { marginTop: 15, overflow: 'visible' } }
    />
    // <View style={ { marginLeft: 20 } }>
    //   <FlatList
    //     horizontal
    //     data={ renderData }
    //     renderItem={ ({ item, index }) => (
    //       <View
    //       // activeOpacity={ 0.8 }
    //       // onPress={ async () => {
    //       //   Alert.alert(
    //       //     'Uprise',
    //       //     'Now your’re switching to on-demand player',
    //       //     [
    //       //       {
    //       //         text: 'Cancel',
    //       //         style: 'cancel',
    //       //       },
    //       //       {
    //       //         text: 'Continue',
    //       //         onPress: async () => {
    //       //           const songInfo = await TrackPlayer.getTrack(0);
    //       //           navigation.navigate('OnDemandMusic', {
    //       //             songList: formatedSongList(treandingSongs),
    //       //             intialSongId: index,
    //       //             songInfo,
    //       //             songState: await TrackPlayer.getState(),
    //       //             position: await TrackPlayer.getPosition(),
    //       //           });
    //       //         },
    //       //       },
    //       //     ],
    //       //   );
    //       // } }
    //     // eslint-disable-next-line react/jsx-closing-bracket-location
    //     >
    //         <View style={ styles.albumsImageView }>
    //           <Image
    //             style={ styles.albumsImage }
    //             source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/music_default_img.png') }
    //           />
    //           <Text style={ styles.albumsTextStyle }>
    //             { item.title }
    //           </Text>
    //           { /* { item.album && item.album.title !== null && (
    //         <View style={ styles.AlbumNameView }>
    //           <SvgImage iconName={ albumVector } iconStyle={ { marginRight: 7 } } width={ 14 } height={ 14 } />
    //           <Text style={ styles.AlbumTitle }>{ item.album.title }</Text>
    //         </View>
    //         ) } */ }
    //           <View style={ styles.AlbumNameView }>
    //             <SvgImage
    //               iconName={ bandVector }
    //               iconStyle={ { marginRight: 7 } }
    //               width={ 12 }
    //               height={ 12 }
    //             />
    //             <Text style={ styles.AlbumTitle }>{ item.band.title }</Text>
    //           </View>
    //         </View>
    //       </View>
    //     ) }
    //     key={ item => item.id }
    //   />
    // </View>
  );
  const navOndemandPage = async item => {
    await AsyncStorage.setItem('onDemandPlayer', 'active');
    const songDetails = [{
      id: item.id,
      artist: item.band.title,
      artwork: item.thumbnail,
      url: item.song,
      title: item.title,
      duration: item.duration,
      isSongFavorite: item.isSongFavorite,
    }];
    const data = {
      songList: songDetails,
      intialSongId: 0,
      songInfo: await TrackPlayer.getTrack(0),
      songState: await TrackPlayer.getState(),
      position: await TrackPlayer.getPosition(),
    };
    dispatch(currentSongDataAction(data));
    await TrackPlayer.reset();
    navigation.navigate('BandDetails',
      {
        bandId: item.band.id,
      });
  };
  return (
    <ScrollView>
      <View>
        { popularBandsList.length > 0
        && (
        <View style={ { marginTop: 12 } }>
          <View style={ styles.AlbumsView }>
            <Text style={ styles.AlbumsText }>
              { strings('DiscoveyPage.popularBands') }
            </Text>
            { /* { popularBandsList.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => {
                  dispatch(discoveryPopularBandsSagaAction({ count: 'all' }));
                  navigation.navigate('AllPopularBands');
                } }
              >
                { strings('General.seeAll') }
              </Text>
              ) } */ }
          </View>
          { renderBandsFlatList(popularBandsList) }
        </View>
        ) }
        { /* { popularAlbums.length > 0
        && (
        <View style={ { marginTop: 12 } }>
          <View style={ styles.AlbumsView }>
            <Text style={ styles.AlbumsText }>
              { strings('DiscoveyPage.popularAlbums') }
            </Text>
            { popularAlbums.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => navigation.navigate('AllAlbums', { isDiscovery: true }) }
              >
                { strings('General.seeAll') }
              </Text>
              ) }
          </View>
          { renderAlbumsFlatList(_.slice(popularAlbums, 0, 10)) }
        </View>
        ) } */ }
        { renderRadioStations() }
        { treandingSongs.length > 0
        && (
        <View>
          <View style={ styles.AlbumsView }>
            <Text style={ styles.AlbumsText }>
              { strings('DiscoveyPage.popularSongs') }
            </Text>
            { treandingSongs.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => {
                  dispatch(treandingSongsSagaAction({ count: 'all' }));
                  navigation.navigate('AllTrendingSongs');
                } }
              >
                { strings('General.seeAll') }
              </Text>
              ) }
          </View>
          { renderTrendyFlatList(_.slice(treandingSongs, 0, 10)) }
        </View>
        ) }
        { /* { genresList.length > 0
        && (
        <View style={ { marginTop: 12 } }>
          <View style={ styles.AlbumsView }>
            <Text style={ styles.AlbumsText }>
              { strings('DiscoveyPage.popularGenre') }
            </Text>
            { genresList.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => navigation.navigate('AllPopularGenres') }
              >
                { strings('General.seeAll') }
              </Text>
              ) }
          </View>
          { renderGenresFlatList(_.slice(genresList, 0, 10)) }
        </View>
        ) } */ }
      </View>
    </ScrollView>
  );
};
export default DiscoveyPage;
