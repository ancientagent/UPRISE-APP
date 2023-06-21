import React, { useState } from 'react';
import {
  View, Image, Text, Modal, Dimensions, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { FlatGrid } from 'react-native-super-grid';
import { Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import styles from './GalleryTab.styles';
import Colors from '../../../theme/colors';
import {
  getBandGallery,
} from '../../../state/selectors/UserProfile';
import { strings } from '../../../utilities/localization/localization';

const GalleryTab = ({ navigation }) => {
  const BandGallery = useSelector(getBandGallery);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const formatedSongList = _.map(BandGallery, data => {
    const url = data.mediaURL;
    const height = 300;
    const width = Dimensions.get('window').width - 20;
    return {
      ...data, url, height, width,
    };
  });
  return (
    <View style={ styles.galleryTabView }>
      <Modal
        transparent
        statusBarTranslucent
        visible={ modalVisible }
      >
        <View style={ styles.modelStyle }>
          <Icon
            containerStyle={ styles.iconStyle }
            type='ionicon'
            name='close'
            size={ 30 }
            color={ Colors.White }
            onPress={ () => setModalVisible(!modalVisible) }
          />
          <View style={ styles.imageViewStyle }>
            <ImageViewer
              imageUrls={ formatedSongList }
              index={ currentIndex }
              enableImageZoom
            />
          </View>
        </View>
      </Modal>
      { BandGallery.length === 0
        ? (
          <Text style={ styles.galleryTxt }>
            { strings('bandDetails.noGallery') }
          </Text>
        )
        : (
          <FlatGrid
            itemContainerStyle={ styles.gridView }
            maxItemsPerRow={ 2 }
            data={ _.slice(BandGallery, 0, 8) }
            keyExtractor={ item => item.id }
            renderItem={ ({ item, index }) => (
              <TouchableOpacity onPress={ () => {
                setCurrentIndex(index);
                setModalVisible(!modalVisible);
              } }
              >
                <Image
                  style={ styles.gridImage }
                  source={ { uri: item.mediaURL } }
                />
                { /* { item.mediaType === 'Photo'
                  ? (
                    <Image
                      style={ styles.gridImage }
                      source={ { uri: item.mediaURL } }
                    />
                  )
                  : (
                    <VideoPlayer
                      autoplay
                      muted
                      hideControlsOnStart
                      thumbnail={ { uri: 'https://images.pexels.com/photos/7745133/pexels-photo-7745133.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load' } }
                      video={ { uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' } }
                    />
                  ) } */ }
              </TouchableOpacity>
            ) }
          />
        ) }
      { BandGallery.length > 8
      && (
      <Text style={ styles.seeMoreText } onPress={ () => navigation.navigate('FullGalleryView') }>
        { strings('General.seeMore') }
      </Text>
      ) }
    </View>
  );
};

export default GalleryTab;
