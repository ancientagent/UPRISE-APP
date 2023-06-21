/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import SvgImage from '../../../components/SvgImage/SvgImage';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './AllAlbums.styles';
import bandVector from '../../../../assets/images/bandVector.svg';
import {
  getBandAlbumsList, getMostPopularAlbumsList,
} from '../../../state/selectors/UserProfile';
import Loader from '../../../components/Loader/Loader';

const AllAlbums = ({ navigation, route }) => {
  const BandAlbumsList = useSelector(getBandAlbumsList);
  const popularAlbums = useSelector(getMostPopularAlbumsList);
  const { bandId } = route.params;
  const { isDiscovery } = route.params;
  const showLoading = useSelector(state => state.albumsList.isWaiting || state.mostPopularAlbums.isWaiting);
  const handleChange = id => {
    navigation.navigate('AlbumSongs', { albumId: id, bandId });
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
            data={ isDiscovery ? popularAlbums : BandAlbumsList }
            key={ item => item.id }
            renderItem={ ({ item }) => (
              <TouchableOpacity
                style={ styles.albumsImageView }
                onPress={ () => (isDiscovery ? navigation.navigate('AlbumSongs', { albumId: item.id, bandId: item.band.id }) : handleChange(item.id)) }
                activeOpacity={ 0.7 }
              >
                <Image
                  style={ styles.albumsImage }
                  source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/album_default_img.png') }
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
                  <Text style={ styles.AlbumTitle }>{ item.title }</Text>
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

export default AllAlbums;
