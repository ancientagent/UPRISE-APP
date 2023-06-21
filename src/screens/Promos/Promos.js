/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, Linking, TouchableOpacity, Platform, Modal, Alert, ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from 'react-native-video-player';
import TrackPlayer
from 'react-native-track-player';
import Colors from '../../theme/colors';
import external from '../../../assets/images/external.svg';
import SvgImage from '../../components/SvgImage/SvgImage';
import styles from './Promos.styles';
import {
  getHomePromos,
} from '../../state/selectors/UserProfile';
import {
  homePromosSagaAction,
} from '../../state/actions/sagas';
import { strings } from '../../utilities/localization/localization';
import Loader from '../../components/Loader/Loader';

const Promos = () => {
  const dispatch = useDispatch();
  const PromosData = useSelector(getHomePromos);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [videoLoad, setVideoLoad] = useState(false);

  const formatedSongList = _.map(PromosData, data => {
    const mediaType = !!_.endsWith(data.banner, 'mp4');
    return {
      ...data, mediaType,
    };
  });
  const showLoading = useSelector(state => state.homePromos.isWaiting);
  useEffect(() => {
    dispatch(homePromosSagaAction());
  }, []);
  const onVideoLoadStart = () => setVideoLoad(true);
  const onVideoLoadEnd = () => setVideoLoad(false);
  return (
    <ScrollView>
      { showLoading
        ? (
          <ActivityIndicator
            size='small'
            color={ Colors.URbtnColor }
          />
        )
        : (
          <>
            <Modal
              transparent
              statusBarTranslucent
              visible={ modalVisible }
            >
              <View style={ { backgroundColor: 'black', height: '100%' } }>
                <Icon
                  containerStyle={ { marginTop: 50, alignSelf: 'flex-end' } }
                  type='ionicon'
                  name='close'
                  size={ 30 }
                  color={ Colors.White }
                  onPress={ async () => {
                    if (playerState === 3 || playerState === 'playing') {
                      await TrackPlayer.play();
                    } else {
                      await TrackPlayer.pause();
                    }
                    setModalVisible(!modalVisible);
                  } }
                />
                <View style={ {
                  height: '80%', width: '95%', justifyContent: 'center', alignSelf: 'center',
                } }
                >
                  { (_.endsWith(currentThumbnail, 'mp4'))
                    ? (
                      <VideoPlayer
                        thumbnail={ videoThumbnail ? { uri: videoThumbnail } : require('../../../assets/images/event.png') }
                        video={ { uri: currentThumbnail } }
                        disableFullscreen
                        progressUpdateInterval={ 5000 }
                        // onLoadStart={ onVideoLoadStart }
                        // onEnd={ onVideoLoadEnd }
                        bufferConfig={ {
                          minBufferMs: 5000, // number
                          maxBufferMs: 50000, // number
                          bufferForPlaybackMs: 2500, // number
                          bufferForPlaybackAfterRebufferMs: 5000, // number
                        } }
                        autoplay
                        resizeMode='stretch'
                      />
                    )
                    : (
                      <Image
                        style={ { height: 250, width: '100%' } }
                        source={ currentThumbnail ? { uri: currentThumbnail } : require('../../../assets/images/event.png') }
                      />
                    ) }
                </View>
              </View>
            </Modal>
            <View style={ { paddingBottom: Platform.OS === 'ios' ? '25%' : '30%' } }>
              { PromosData.length === 0 && !showLoading
                ? (
                  <View style={ styles.eventView }>
                    <Text style={ styles.emptyTxt }>
                      { strings('bandDetails.noPromos') }
                    </Text>
                  </View>
                )
                : (
                  <FlatList
                    data={ formatedSongList }
                    renderItem={ ({ item }) => (
                      <View style={ styles.eventView }>
                        { item.mediaType
                          ? (
                            <View>
                              <Image
                                style={ styles.eventImage }
                                source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/event.png') }
                              />
                              <TouchableOpacity
                                style={ {
                                  bottom: 50,
                                  alignSelf: 'center',
                                  width: 50,
                                  borderRadius: 50,
                                  height: 50,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                  position: 'absolute',
                                } }
                                onPress={ async () => {
                                  setPlayerState(await TrackPlayer.getState());
                                  await TrackPlayer.pause();
                                  setCurrentThumbnail(item.banner);
                                  setVideoThumbnail(item.thumbnail);
                                  setModalVisible(!modalVisible);
                                } }
                                disabled={ item.banner === null }
                              >
                                <Icon
                                  containerStyle={ { margin: 0 } }
                                  type='ionicon'
                                  name='play'
                                  size={ 30 }
                                  color={ Colors.White }
                                />
                              </TouchableOpacity>
                            </View>
                          )
                          : (
                            <TouchableOpacity
                              onPress={ () => {
                                setCurrentThumbnail(item.banner);
                                setModalVisible(!modalVisible);
                              } }
                              disabled={ item.banner === null }
                            >
                              <Image
                                style={ styles.eventImage }
                                source={ item.banner ? { uri: item.banner } : require('../../../assets/images/event.png') }
                              />
                            </TouchableOpacity>
                          ) }
                        <View style={ { marginHorizontal: 10 } }>
                          <View style={ styles.eventTextView }>
                            <Text style={ styles.eventText } numberOfLines={ 1 }>
                              { item.title }
                            </Text>
                          </View>
                          <Text style={ styles.bandSubText }>
                            <Text style={ styles.bandText }>
                              Description:
                            </Text>
                            { ' ' }
                            { item.description }
                          </Text>
                          <TouchableOpacity
                            style={ { flexDirection: 'row', alignItems: 'center' } }
                            onPress={ () => {
                              if (_.startsWith(item.link, 'https://' || 'http://')) {
                                Linking.openURL(item.link);
                              } else {
                                Alert.alert('link is not working');
                              }
                            } }
                          >
                            <Text style={ {
                              marginTop: 2,
                              textDecorationLine: 'underline',
                              fontFamily: 'Oswald Medium',
                              fontWeight: '500',
                              fontSize: 14,
                              color: Colors.URbtnColor,
                            } }
                            >
                              Click here
                            </Text>
                            <SvgImage
                              iconStyle={ { marginTop: 5, marginLeft: 2 } }
                              iconName={ external }
                              width={ 15 }
                              height={ 15 }
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) }
                    keyExtractor={ item => item.id }
                  />
                ) }
            </View>
          </>
        ) }
    </ScrollView>
  );
};

export default Promos;
