/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View, Text, ImageBackground, Image, FlatList, TouchableOpacity, Alert,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import Colors from '../../../theme/colors';
import URContainer from '../../../components/URContainer/URContainer';
import styles from './AlbumSongs.styles';
import {
  songListSagaAction, albumDetailsSagaAction,
} from '../../../state/actions/sagas';
import { getSongList, getalbumDetails } from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AlbumSongs = ({ navigation, route }) => {
  const { albumId } = route.params;
  const { bandId } = route.params;
  const showLoading = useSelector(state => state.songList.isWaiting || state.albumDetails.isWaiting);
  const dispatch = useDispatch();
  const songData = useSelector(getSongList);
  const albumDetails = useSelector(getalbumDetails);
  useEffect(() => {
    const payload = {
      albumId, bandId,
    };
    dispatch(songListSagaAction(payload));
    dispatch(albumDetailsSagaAction(payload));
  }, []);
  const formatedSongList = _.map(songData, data => {
    const url = data.song;
    const artist = _.get(data, 'band.title', '');
    const artwork = data.thumbnail;
    return {
      ...data, url, artwork, artist,
    };
  });
  useEffect(() => {}, [songData]);
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
            //             songList: formatedSongList,
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
            <ImageBackground
              style={ styles.bgImgStyle }
              source={ albumDetails.thumbnail ? { uri: albumDetails.thumbnail } : require('../../../../assets/images/Fullprev_album_img.png') }
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
            <View>
              <View style={ styles.albumView }>
                <Text style={ styles.albumTitle }>
                  { albumDetails.title }
                </Text>
                <Text style={ styles.albumSubText }>
                  { albumDetails.band && albumDetails.band.title }
                </Text>
              </View>
              <View style={ { height: '60%' } }>
                { renderSongsList(songData) }
              </View>
            </View>
          </View>
          <View style={ styles.miniPlayerStyle } />
        </View>
      </URContainer>
    </>
  );
};

export default AlbumSongs;
