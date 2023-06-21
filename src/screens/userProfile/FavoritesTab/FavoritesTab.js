/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Alert,
} from 'react-native';
import _ from 'lodash';
import { Divider } from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage
from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import SvgImage from '../../../components/SvgImage/SvgImage';
import Colors from '../../../theme/colors';
import styles from './FavoritesTab.styles';
import favSymbolFilledIcon from '../../../../assets/images/favSymbolFilledIcon.svg';
import { songUnfavoriteSagaAction, favoriteSongListSagaAction } from '../../../state/actions/sagas';
import { favoriteSongList, currentSongData } from '../../../state/selectors/UserProfile';
import { strings } from '../../../utilities/localization/localization';
import Loader from '../../../components/Loader/Loader';
import { currentSongDataAction } from '../../../state/actions/currentSongData/currentSongData.action';

const FavoritesTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const showLoading = useSelector(state => state.favoriteSongList.isWaiting);
  const favSongList = useSelector(favoriteSongList);
  const songData = useSelector(currentSongData);
  const [playerState, setPlayerState] = useState(false);
  useEffect(() => {}, [favSongList]);
  useEffect(() => {
    async function fetchData() {
      const e = await AsyncStorage.getItem('onDemandPlayer');
      setPlayerState(e === 'active');
    }
    fetchData();
    dispatch(favoriteSongListSagaAction());
  }, []);
  const songunfavorite = id => {
    const playlistData = songData.songList;
    if (playerState && id === playlistData[0].id) {
      const songList = playlistData.map(data => ({ ...data, isSongFavorite: false }));
      dispatch(currentSongDataAction({ ...songData, songList }));
    }
    const payload = {
      songId: id,
    };
    dispatch(songUnfavoriteSagaAction(payload));
  };
  const formatedSongList = _.map(favSongList, data => {
    const url = data.song;
    const artist = _.get(data, 'band.title', '');
    const artwork = data.thumbnail;
    return {
      ...data, url, artwork, artist,
    };
  });
  const renderFavoritesData = renderData => (
    <>
      <FlatList
        data={ renderData }
        renderItem={ ({ item, index }) => (
          <View style={ { marginHorizontal: 28 } }>
            <View style={ styles.FavoritesTabView }>
              <TouchableOpacity
                style={ styles.ImageViewStyle }
                activeOpacity={ 0.7 }
                onPress={ async () => {
                  Alert.alert(
                    'Uprise',
                    'Now your’re switching to on-demand player',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Continue',
                        onPress: async () => {
                          const songInfo = await TrackPlayer.getTrack(0);
                          navigation.navigate('OnDemandMusic', {
                            songList: formatedSongList,
                            intialSongId: index,
                            songInfo,
                            songState: await TrackPlayer.getState(),
                            position: await TrackPlayer.getPosition(),
                          });
                        },
                      },
                    ],
                  );
                } }
              >
                <Image
                  style={ styles.ImageStyle }
                  source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                />
                <View>
                  <Text style={ styles.titleStyle }>
                    { item.title }
                  </Text>
                  <Text style={ styles.subText }>
                    { item.band.title }
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => songunfavorite(item.id) }>
                <SvgImage
                  iconStyle={ { marginRight: 0 } }
                  iconName={ favSymbolFilledIcon }
                  height={ 22 }
                  width={ 22 }
                />
              </TouchableOpacity>
            </View>
            <Divider
              orientation='horizontal'
              width={ 0.4 }
              color={ Colors.dividerColor }
            />
          </View>
        ) }
      />
    </>
  );
  return (
    <View style={ styles.FavoritesViewStyle }>
      <Loader
        visible={ showLoading }
      />
      <Text style={ styles.songsText }>
        { strings('userProfile.favorites') }
      </Text>
      { !(Object.keys(favSongList).length === 0)
      && (
      <View>
        { renderFavoritesData(favSongList) }
      </View>
      ) }
    </View>
  );
};

export default FavoritesTab;
