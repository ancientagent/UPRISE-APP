/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, ActivityIndicator, Platform, ScrollView,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import AsyncStorage
from '@react-native-community/async-storage';
import Pause from '../../../assets/images/pause.svg';
import Colors from '../../theme/colors';
import URContainer from '../../components/URContainer/URContainer';
import SvgImage from '../../components/SvgImage/SvgImage';
import playBtn from '../../../assets/images/playBtn.svg';
import songSkipBtn from '../../../assets/images/songSkipBtn.svg';
import radioBlastOutline from '../../../assets/images/radio_Blast_outline.svg';
import radioBlast from '../../../assets/images/radioBlast.svg';
import styles from './radioScreen.styles';
import { getRadioSong, getUserDetails } from '../../state/selectors/UserProfile';
import {
  getRadioSongSagaAction, songBlastSagaAction, postSongIdSagaAction, songfavoriteSagaAction, songUnfavoriteSagaAction,
} from '../../state/actions/sagas';
import favSymbolIcon from '../../../assets/images/favSymbolIcon.svg';
import favSymbolFilledIcon from '../../../assets/images/favSymbolFilledIcon.svg';
import disableNext from '../../../assets/images/disableNext.svg';
import UseProgress from '../../components/UseProgress/UseProgress';

const RadioScreen = () => {
  const [handleBlast, setHandleBlast] = useState();
  const playbackState = usePlaybackState();
  const songData = useSelector(getRadioSong);
  const dispatch = useDispatch();
  const listenerId = useSelector(getUserDetails);
  const [initialState, setInitialState] = useState(listenerId.radioPrefrence && listenerId.radioPrefrence.stationType);
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [favSong, setFav] = useState();
  const [hideSkip, setHideSkip] = useState(false);
  useEffect(() => {
    async function Storage() {
      await AsyncStorage.setItem('page', 'radio');
    }
    Storage();
  }, []);

  useEffect(() => {
    if (songData.songId) {
      setupIfNecessary();
    }
  }, [songData]);

  const songInfo = {
    url: songData.url,
    title: songData.title,
    artist: songData.band ? songData.band.title : '',
    id: songData.songId,
    artwork: songData.thumbnail,
    duration: songData.duration,
  };

  const setupIfNecessary = async () => {
    setHandleBlast(songData.isSongBlasted);
    setFav(songData.isSongFavourited);
    setTrackTitle(songData.title);
    setTrackArtist(songData.band ? songData.band.title : '');
    setTrackArtwork(songData.thumbnail);
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      return;
    }
    await TrackPlayer.reset();
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        // Capability.SkipToNext,
        // Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],
    });
    await TrackPlayer.add(songInfo);
    await TrackPlayer.play();
    await TrackPlayer.removeUpcomingTracks();
  };

  const togglePlayback = async playbackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      // TODO: Perhaps present an error or restart the playlist?
    } else if (playbackState !== State.Playing) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    const page = await AsyncStorage.getItem('page') || 'other';
    console.log(`TrackPlayerEvent = ${JSON.stringify(event)}}`, page);
    if (page !== 'demand' && songData.songId) {
      await (() => new Promise(resolve => {
        const payload = {
          songId: songData.songId,
          listenSource: 'radio',
          callback: resolve,
        };
        dispatch(postSongIdSagaAction(payload));
      }))();
      dispatch(getRadioSongSagaAction());
      await TrackPlayer.reset();
      await TrackPlayer.updateMetadataForTrack(0, songInfo);
      await TrackPlayer.play();
    }
  });

  const songBlast = () => {
    setHandleBlast(true);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songBlastSagaAction(payload));
  };

  const songfavorite = () => {
    setFav(true);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songfavoriteSagaAction(payload));
  };
  const songunfavorite = () => {
    setFav(false);
    const payload = {
      songId: songData.songId,
    };
    dispatch(songUnfavoriteSagaAction(payload));
  };
  const skipNext = async () => {
    await (() => new Promise(resolve => {
      const payload = {
        songId: songData.songId,
        listenSource: 'radio',
        callback: resolve,
      };
      dispatch(postSongIdSagaAction(payload));
    }))();
    dispatch(getRadioSongSagaAction());
    await TrackPlayer.reset();
    await TrackPlayer.updateMetadataForTrack(0, songInfo);
    await TrackPlayer.play();
  };
  const returnPlayBtn = () => {
    switch (playbackState) {
      case State.Playing:
        return <SvgImage iconName={ Pause } height={ 32 } width={ 32 } />;
      case State.Paused:
        return <SvgImage iconName={ playBtn } height={ 32 } width={ 32 } />;
      case State.Ready:
        return <SvgImage iconName={ playBtn } height={ 32 } width={ 32 } />;
      default:
        return (
          Platform.OS === 'ios'
            ? (
              <Image
                style={ styles.songLoader }
                source={ require('../../../assets/images/song_loader.gif') }
              />
            )
            : (
              <ActivityIndicator size={ 30 } color={ Colors.URbtnColor } />
            )
        );
    }
  };
  const defaultPlayerImg = require('../../../assets/images/Fullprev_muisc_img.png');
  return (
    <URContainer>
      <ScrollView contentContainerStyle={ {
        alignItems: 'center',
        height: '100%',
      } }
      >
        <View style={ styles.Container }>
          <Image
            style={ styles.playerImage }
            source={ trackArtwork ? { uri: `${trackArtwork}` } : defaultPlayerImg }
          />
          <View style={ styles.textContainer }>
            <View style={ { maxWidth: '70%' } }>
              <MarqueeText
                speed={ 0.2 }
                marqueeOnStart
                loop
                delay={ 1000 }
              >
                <Text style={ styles.songTitle }>
                  { trackTitle }
                </Text>
              </MarqueeText>
              <MarqueeText
                speed={ 0.2 }
                marqueeOnStart
                loop
                delay={ 1000 }
              >
                <Text style={ styles.songArtistText }>
                  { trackArtist }
                </Text>
              </MarqueeText>
            </View>
            { favSong
              ? (
                <TouchableOpacity onPress={ songunfavorite } disabled={ !songData.songId }>
                  <SvgImage
                    iconStyle={ { marginRight: 0 } }
                    iconName={ favSymbolFilledIcon }
                    height={ 23 }
                    width={ 21 }
                  />
                </TouchableOpacity>
              )
              : (
                <TouchableOpacity onPress={ songfavorite } disabled={ !songData.songId }>
                  <SvgImage iconStyle={ { marginRight: 0 } } iconName={ favSymbolIcon } height={ 23 } width={ 21 } />
                </TouchableOpacity>
              ) }
          </View>
          <View style={ { marginTop: 35 } }>
            <UseProgress
              sliderStyle={ { height: 20 } }
              trackStyle={ { borderRadius: 0 } }
              thumbStyle={ styles.thumbStyle }
              disabled
              timeTextView={ styles.songTimeStyle }
              timeText={ styles.timeText }
              hideSkip={ hideSkip }
              setHideSkip={ setHideSkip }
            />
            <View style={ styles.actionBtnContainer }>
              { hideSkip
                ? (
                  <TouchableOpacity onPress={ skipNext } disabled={ !songData.songId }>
                    <SvgImage iconName={ songSkipBtn } height={ 28 } width={ 32 } />
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity>
                    <SvgImage iconName={ disableNext } height={ 28 } width={ 32 } />
                  </TouchableOpacity>
                ) }
              { handleBlast
                ? (
                  <SvgImage iconName={ radioBlast } height={ 32 } width={ 32 } />
                )
                : (
                  <TouchableOpacity onPress={ songBlast } disabled={ !songData.songId }>
                    <SvgImage iconName={ radioBlastOutline } height={ 32 } width={ 32 } />
                  </TouchableOpacity>
                ) }
              <TouchableOpacity onPress={ () => togglePlayback(playbackState) }>
                { returnPlayBtn() }
              </TouchableOpacity>
            </View>
            <View style={ styles.locationView }>
              <Icon
                type='ionicon'
                size={ 13 }
                name='location-outline'
                color={ Colors.White }
              />
              <Text style={ styles.locationText }>
                { parseInt(initialState) === 2 ? songData.stateName : songData.cityName }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </URContainer>
  );
};

export default RadioScreen;
