/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  View, Image, Modal, TouchableOpacity, Dimensions,
} from 'react-native';
import _ from 'lodash';
import { FlatGrid } from 'react-native-super-grid';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';
import Colors from '../../../theme/colors';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './FullGalleryView.styles';
import {
  getBandGallery,
} from '../../../state/selectors/UserProfile';

const FullGalleryView = ({ navigation }) => {
  const BandGallery = useSelector(getBandGallery);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState();
  const formatedSongList = _.map(BandGallery, data => {
    const url = data.mediaURL;
    const height = 300;
    const width = Dimensions.get('window').width - 20;
    return {
      ...data, url, height, width,
    };
  });
  return (
    <URHeaderContainer>
      <View style={ styles.fullGalleryView }>
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
            <View style={ styles.imageView }>
              <ImageViewer
                imageUrls={ formatedSongList }
                index={ currentIndex }
                enableImageZoom
              />
            </View>
          </View>
        </Modal>
        <View style={ styles.fullGalleryContainer }>
          <FlatGrid
            itemContainerStyle={ styles.gridView }
            maxItemsPerRow={ 2 }
            data={ BandGallery }
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
              </TouchableOpacity>
            ) }
          />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URHeaderContainer>
  );
};

export default FullGalleryView;
