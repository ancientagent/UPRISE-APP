/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity, Alert,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import TrackPlayer from 'react-native-track-player';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import albumVector from '../../../../assets/images/albumVector.svg';
import bandVector from '../../../../assets/images/bandVector.svg';
import SvgImage from '../../../components/SvgImage/SvgImage';
import styles from '../Statistics.styles';
import {
  getMostPlayedSongList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllMostPlayedSongs = props => {
  const { navigation } = props;
  const mostPlayedSongsList = useSelector(getMostPlayedSongList);
  const showLoading = useSelector(state => state.mostPlayedSongs.isWaiting);
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
            data={ mostPlayedSongsList }
            key={ item => item.id }
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
                //             songList: formatedSongList(mostPlayedSongsList),
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
                <View style={ styles.albumsImageView }>
                  <Image
                    style={ styles.albumsImage }
                    source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                  />
                  <Text style={ styles.albumsTextStyle }>
                    { item.title }
                  </Text>
                  { /* { item.album && item.album.title !== null
                  && (
                  <View style={ styles.AlbumNameView }>
                    <SvgImage iconName={ albumVector } iconStyle={ { marginRight: 7 } } width={ 14 } height={ 14 } />
                    <Text style={ styles.AlbumTitle }>{ item.album.title }</Text>
                  </View>
                  ) } */ }
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
              </View>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default AllMostPlayedSongs;
