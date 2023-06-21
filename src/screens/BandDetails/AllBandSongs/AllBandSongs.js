/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './AllBandSongs.styles';
import {
  getBandSongList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllBandSongs = ({ navigation }) => {
  const BandAlbumsList = useSelector(getBandSongList);
  const showLoading = useSelector(state => state.getBandSongList.isWaiting);
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
            data={ BandAlbumsList }
            key={ item => item.id }
            renderItem={ ({ item }) => (
              <View
                style={ styles.albumsImageView }
              >
                <Image
                  style={ styles.albumsImage }
                  source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/music_default_img.png') }
                />
                <Text style={ styles.albumsTextStyle } numberOfLines={ 1 } ellipsizeMode='tail'>
                  { item.title }
                </Text>
              </View>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default AllBandSongs;
