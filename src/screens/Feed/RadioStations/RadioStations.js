/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity, ImageBackground, Platform, Alert,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import SvgImage from '../../../components/SvgImage/SvgImage';
import Colors from '../../../theme/colors';
import albumVector from '../../../../assets/images/albumVector.svg';
import bandVector from '../../../../assets/images/bandVector.svg';
import URContainer from '../../../components/URContainer/URContainer';
import styles from './RadioStations.styles';
import fullRadioStations from '../../../../assets/images/full_radio_station.svg';
import {
  getRadioStationsSongsSagaAction, getSongsByGenreSagaAction,
} from '../../../state/actions/sagas';
import { getRadioStationsSongs, getsongsByGenre } from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const RadioStations = ({ route, navigation }) => {
  const { isDiscovery } = route.params;
  const { stateName } = route.params;
  const { bgColor } = route.params;
  const { genreId } = route.params;
  const { genreName } = route.params;

  const dispatch = useDispatch();
  const showLoading = useSelector(state => state.getRadioStationsSongs.isWaiting || state.songsByGenre.isWaiting);
  const songData = useSelector(getRadioStationsSongs);
  const getSongByGenre = useSelector(getsongsByGenre);

  useEffect(() => {
    if (isDiscovery) {
      dispatch(getSongsByGenreSagaAction(genreId));
    } else {
      dispatch(getRadioStationsSongsSagaAction(stateName));
    }
  }, []);
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
  const renderSongsList = renderData => (
    <>
      <FlatList
        data={ renderData }
        renderItem={ ({ item, index }) => (
          <View
            // onPress={ async () => {
            //   Alert.alert(
            //     'Uprise',
            //     'Now your’re switching to on-demand player',
            //     [
            //       {
            //         text: 'Cancel',
            //         style: 'cancel',
            //       },
            //       {
            //         text: 'Continue',
            //         onPress: async () => {
            //           const songInfo = await TrackPlayer.getTrack(0);
            //           navigation.navigate('OnDemandMusic', {
            //             songList: formatedSongList(isDiscovery ? getSongByGenre : songData),
            //             intialSongId: index,
            //             songInfo,
            //             songState: await TrackPlayer.getState(),
            //             position: await TrackPlayer.getPosition(),
            //           });
            //         },
            //       },
            //     ],
            //   );
            // } }
          // eslint-disable-next-line react/jsx-closing-bracket-location
          >
            <View style={ { marginHorizontal: 28 } }>
              <View style={ styles.songView }>
                <View style={ styles.songImgView }>
                  <Image
                    style={ styles.songImg }
                    source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                  />
                  <View>
                    <Text style={ styles.songTitle }>
                      { item.title }
                    </Text>
                    { /* { item.album && item.album.title !== null && (
                    <View style={ styles.AlbumNameView }>
                      <SvgImage
                        iconName={ albumVector }
                        iconStyle={ { marginRight: 7, marginTop: 2 } }
                        width={ 14 }
                        height={ 14 }
                      />
                      <Text style={ styles.albumSubText }>{ item.album.title }</Text>
                    </View>
                    ) } */ }
                    <View style={ styles.AlbumNameView }>
                      <SvgImage
                        iconName={ bandVector }
                        iconStyle={ { marginRight: 7, marginTop: 2 } }
                        width={ 12 }
                        height={ 12 }
                      />
                      <Text style={ styles.albumSubText }>{ item.band.title }</Text>
                    </View>
                  </View>
                </View>
                <Text style={ styles.timeText }>
                  { new Date(item.duration * 1000)
                    .toISOString()
                    .substr(14, 5) }
                </Text>
              </View>
            </View>
          </View>
        ) }
        key={ item => item.id }
      />
    </>
  );
  return (
    <>
      <Loader
        visible={ showLoading }
      />
      <URContainer>
        <View style={ styles.contentView }>
          <View style={ { height: '85%' } }>
            { isDiscovery
              ? (
                <ImageBackground
                  style={ styles.bgImgStyle }
                  source={ require('../../../../assets/images/feed_music_img.png') }
                >
                  <View style={ styles.iconPosition }>
                    <View style={ styles.iconStyle }>
                      <Icon
                        type='ionicon'
                        name='chevron-back-outline'
                        size={ 24 }
                        color={ Colors.White }
                        onPress={ () => navigation.goBack() }
                      />
                    </View>
                  </View>
                </ImageBackground>
              ) : (
                <>
                  <SvgImage
                    iconName={ fullRadioStations }
                    iconStyle={ { backgroundColor: bgColor, width: '100%' } }
                    width='110%'
                    height={ 252 }
                  />
                  <View style={ styles.overlayer }>
                    <View style={ styles.iconStyle }>
                      <Icon
                        type='ionicon'
                        name='chevron-back-outline'
                        size={ 24 }
                        style={ { height: 30, width: 30, justifyContent: 'center' } }
                        color={ Colors.White }
                        onPress={ () => navigation.goBack() }
                      />
                    </View>
                    <Text
                      style={ styles.stateName }
                      numberOfLines={ 1 }
                      ellipsizeMode='tail'
                    >
                      { stateName }
                    </Text>
                  </View>
                </>
              ) }
            <View>
              <View style={ styles.albumView }>
                <Text style={ styles.albumTitle } numberOfLines={ 1 } ellipsizeMode='tail'>
                  { isDiscovery ? genreName : stateName }
                </Text>
              </View>
              <View style={ { height: Platform.OS === 'ios' ? '63%' : '59%' } }>
                { renderSongsList(isDiscovery ? getSongByGenre : songData) }
              </View>
            </View>
          </View>
          <View style={ styles.miniPlayerStyle } />
        </View>
      </URContainer>
    </>
  );
};

export default RadioStations;
