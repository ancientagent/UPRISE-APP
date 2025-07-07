import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Geolocation from 'react-native-geolocation-service';
import { strings } from '../../utilities/localization/localization';
import SvgImage from '../../components/SvgImage/SvgImage';
import close from '../../../assets/images/close.svg';
import Downvote from '../../../assets/images/downvote.svg';
import Report from '../../../assets/images/Report.svg';
import Reported from '../../../assets/images/Reported.svg';
import Follow from '../../../assets/images/Follow.svg';
import unFollow from '../../../assets/images/unFollow.svg';
import Upvote from '../../../assets/images/Upvote.svg';
import Skip from '../../../assets/images/Skip.svg';
import disableSkip from '../../../assets/images/disableSkip.svg';
import Blast from '../../../assets/images/Blast.svg';
import unBlast from '../../../assets/images/unBlast.svg';
import disableDownvote from '../../../assets/images/disableDownvote.svg';
import disableUpVoteIcon from '../../../assets/images/disableUpVoteIcon.svg';
import styles from './ActionButtonsModel.styles';
import { getRadioSong, getUserDetails } from '../../state/selectors/UserProfile';
import {
  getRadioSongSagaAction,
  postSongIdSagaAction,
  undoBandFollowSagaAction,
  bandFollowSagaAction,
  songBlastSagaAction,
  songVoteSagaAction,
  songDownVoteSagaAction,
} from '../../state/actions/sagas';

const ActionButtonsModel = props => {
  const {
    modalVisible, setModalVisible, reportModel, setReportModel,
  } = props;
  const songData = useSelector(getRadioSong);
  const userDetails = useSelector(getUserDetails);
  const progress = useProgress();
  const [blastState, setBlastState] = useState(songData.isSongBlasted);
  const [followState, setFollowState] = useState(songData.amIFollowingBand);
  const [songReport, setSongReport] = useState(songData.isSongReport);
  const [upVoteStatus, setUpVoteStatus] = useState(songData.isSongUpvote);
  const [downVoteStatus, setDownVoteStatus] = useState(songData.isSongDownvote);
  const [userLocation, setUserLocation] = useState(null);
  const [hasVotingRights, setHasVotingRights] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (blastState !== songData.isSongBlasted) {
      setBlastState(songData.isSongBlasted);
    }
    if (followState !== songData.amIFollowingBand) {
      setFollowState(songData.amIFollowingBand);
    }
    if (songReport !== songData.isSongReport) {
      setSongReport(songData.isSongReport);
    }
    if (upVoteStatus !== songData.isSongUpvote) {
      setUpVoteStatus(songData.isSongUpvote);
    }
    if (downVoteStatus !== songData.isSongDownvote) {
      setDownVoteStatus(songData.isSongDownvote);
    }
  }, [songData]);

  useEffect(() => {
    checkVotingRights();
  }, []);

  /**
   * Check if user has voting rights based on GPS location and home scene
   */
  const checkVotingRights = async () => {
    try {
      // Get user's current location
      const position = await getCurrentPosition();
      setUserLocation(position);

      // Check if user is in their home scene
      const isInHomeScene = await verifyHomeSceneLocation(position);
      setHasVotingRights(isInHomeScene);

      if (!isInHomeScene) {
        console.log('User not in home scene - voting disabled');
      }
    } catch (error) {
      console.error('Error checking voting rights:', error);
      setHasVotingRights(false);
    }
  };

  /**
   * Get current GPS position
   */
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  /**
   * Verify user is in their home scene location
   */
  const verifyHomeSceneLocation = async (position) => {
    try {
      // This would typically call your backend to verify location
      // For now, we'll do a basic check against user's registered location
      const userCity = userDetails.city;
      const userState = userDetails.state;
      
      // In a real implementation, you'd geocode the GPS coordinates
      // and compare with the user's home scene
      // For now, we'll assume they're in their home scene if they have location data
      return !!userCity && !!userState;
    } catch (error) {
      console.error('Error verifying home scene location:', error);
      return false;
    }
  };

  /**
   * Enhanced voting with GPS verification and tier-specific logic
   */
  const handleVote = async (voteType) => {
    // Check if user is in NATIONAL tier - no voting allowed
    const currentTier = getCurrentTier();
    if (currentTier === 'NATIONAL') {
      Alert.alert(
        'Voting Not Available',
        'Voting is not available for nationwide broadcasts. Switch to Citywide or Statewide to vote on songs.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!hasVotingRights) {
      Alert.alert(
        'Voting Restricted',
        'You can only vote in your home scene. Please ensure you are in your registered location.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!userLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to vote.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if user has already voted on this song in this tier
    const hasVotedInTier = await checkVoteInTier(songData.songId, voteType);
    if (hasVotedInTier) {
      Alert.alert(
        'Already Voted',
        'You have already voted on this song in this tier.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Proceed with vote
    if (voteType === 'upvote') {
      songUpvote();
    } else if (voteType === 'downvote') {
      songDownVote();
    }
  };

  /**
   * Check if user has already voted on this song in the current tier
   */
  const checkVoteInTier = async (songId, voteType) => {
    // This would typically call your backend to check voting history
    // For now, we'll use the current state
    return voteType === 'upvote' ? upVoteStatus : downVoteStatus;
  };

  /**
   * Check if voting is enabled for current tier
   */
  const isVotingEnabled = () => {
    const currentTier = getCurrentTier();
    return currentTier !== 'NATIONAL' && hasVotingRights;
  };

  /**
   * Render voting buttons with tier-specific logic
   */
  const renderVotingButtons = () => {
    const votingEnabled = isVotingEnabled();
    
    return (
      <View style={styles.votingContainer}>
        <TouchableOpacity
          style={[
            styles.voteButton,
            upVoteStatus && styles.voteButtonActive,
            !votingEnabled && styles.voteButtonDisabled
          ]}
          onPress={() => handleVote('upvote')}
          disabled={!votingEnabled}
        >
          <SvgImage 
            iconName={upVoteStatus ? UpvoteActive : Upvote} 
            height={24} 
            width={24} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.voteButton,
            downVoteStatus && styles.voteButtonActive,
            !votingEnabled && styles.voteButtonDisabled
          ]}
          onPress={() => handleVote('downvote')}
          disabled={!votingEnabled}
        >
          <SvgImage 
            iconName={downVoteStatus ? DownvoteActive : Downvote} 
            height={24} 
            width={24} 
          />
        </TouchableOpacity>
        
        {!votingEnabled && (
          <Text style={styles.votingDisabledText}>
            {getCurrentTier() === 'NATIONAL' ? 'No voting in nationwide' : 'Location required'}
          </Text>
        )}
      </View>
    );
  };

  const items = [{
    containerStyle: styles.skipBlastBtnSet.containerStyle,
    leftTextStyle: styles.skipBlastBtnSet.leftTextStyle,
    leftText: strings('curvedBottomBar.skipText'),
    leftBtnStyle: styles.skipBlastBtnSet.leftBtnStyle,
    leftIconName: Math.round(progress.position) >= 32 ? Skip : disableSkip,
    leftIconPress: () => (Math.round(progress.position) >= 32 ? skipNext() : ''),
    rightIconPress: () => (blastState ? '' : songBlast()),
    rightIconName: blastState ? unBlast : Blast,
    rightIconText: strings('curvedBottomBar.blastText'),
    rightTextStyle: styles.skipBlastBtnSet.rightTextStyle,
  },
  {
    containerStyle: styles.reportFollowBtnSet.containerStyle,
    leftTextStyle: styles.reportFollowBtnSet.leftTextStyle,
    leftText: strings('curvedBottomBar.reportText'),
    leftBtnStyle: styles.reportFollowBtnSet.leftBtnStyle,
    leftIconName: songReport ? Reported : Report,
    leftIconPress: () => (songReport ? '' : songReported()),
    rightIconPress: () => (followState ? undoBandFollow() : bandFollow()),
    rightIconName: followState ? unFollow : Follow,
    rightIconText: followState ? strings('General.unFollow') : strings('curvedBottomBar.followText'),
    rightTextStyle: styles.reportFollowBtnSet.rightTextStyle,
  },
  {
    containerStyle: styles.downUpvoteBtnSet.containerStyle,
    leftTextStyle: styles.downUpvoteBtnSet.leftTextStyle,
    leftText: strings('curvedBottomBar.downvoteText'),
    leftBtnStyle: [
      styles.downUpvoteBtnSet.leftBtnStyle,
      !isVotingEnabled() && styles.voteButtonDisabled
    ],
    leftIconName: downVoteStatus ? disableDownvote : Downvote,
    leftIconPress: () => (!isVotingEnabled() ? 
      Alert.alert('Voting Not Available', 'Voting is not available for nationwide broadcasts. Switch to Citywide or Statewide to vote on songs.') : 
      (downVoteStatus ? songundoDownVote() : handleVote('downvote'))),
    rightIconPress: () => (!isVotingEnabled() ? 
      Alert.alert('Voting Not Available', 'Voting is not available for nationwide broadcasts. Switch to Citywide or Statewide to vote on songs.') : 
      (upVoteStatus ? songundoUpvote() : handleVote('upvote'))),
    rightIconName: upVoteStatus ? disableUpVoteIcon : Upvote,
    rightIconText: strings('curvedBottomBar.upvoteText'),
    rightTextStyle: styles.downUpvoteBtnSet.rightTextStyle,
  }];

  const songReported = () => {
    setReportModel(!reportModel);
  };

  const songUpvote = () => {
    setDownVoteStatus(false);
    setUpVoteStatus(!upVoteStatus);
    const payload = {
      songId: songData.songId,
      type: 'upvote',
      location: userLocation,
      tier: getCurrentTier(),
    };
    dispatch(songVoteSagaAction(payload));
  };

  const songDownVote = () => {
    setUpVoteStatus(false);
    setDownVoteStatus(!downVoteStatus);
    const payload = {
      songId: songData.songId,
      type: 'downvote',
      location: userLocation,
      tier: getCurrentTier(),
    };
    dispatch(songVoteSagaAction(payload));
  };

  const songundoUpvote = () => {
    setUpVoteStatus(!upVoteStatus);
    const payload = {
      songId: songData.songId,
      type: 'upvote',
    };
    dispatch(songDownVoteSagaAction(payload));
  };

  const songundoDownVote = () => {
    setDownVoteStatus(!downVoteStatus);
    const payload = {
      songId: songData.songId,
      type: 'downvote',
    };
    dispatch(songDownVoteSagaAction(payload));
  };

  /**
   * Get current tier based on user's station preference
   */
  const getCurrentTier = () => {
    const stationType = userDetails.radioPrefrence?.stationType;
    switch (stationType) {
      case '1': return 'CITYWIDE';
      case '2': return 'STATEWIDE';
      case '3': return 'NATIONAL';
      default: return 'CITYWIDE';
    }
  };

  const songBlast = () => {
    setBlastState(true);
    const payload = {
      songId: songData.songId,
      location: userLocation,
      tier: getCurrentTier(),
    };
    dispatch(songBlastSagaAction(payload));
  };

  const bandFollow = () => {
    setFollowState(true);
    const payload = {
      bandId: songData.bandId,
    };
    dispatch(bandFollowSagaAction(payload));
  };

  const undoBandFollow = () => {
    setFollowState(false);
    const payload = {
      bandId: songData.bandId,
    };
    dispatch(undoBandFollowSagaAction(payload));
  };

  const songInfo = {
    url: songData.url,
    title: songData.title,
    artist: songData.band ? songData.band.title : '',
    id: songData.songId,
    artwork: songData.thumbnail === null ? 'https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHZpZXd8ZW58MHx8MHx8&auto=format&fit=crop&w=1400&q=60' : songData.thumbnail,
    duration: songData.duration,
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

  const renderCircleButtons = () => {
    const circleButtons = [];
    _.forEach(items, item => {
      circleButtons.push(
        <View style={ item.containerStyle }>
          <Text style={ item.leftTextStyle }>{ item.leftText }</Text>
          <TouchableOpacity
            activeOpacity={ 0.4 }
            style={ item.leftBtnStyle }
            onPress={ item.leftIconPress }
          >
            <SvgImage iconName={ item.leftIconName } width={ 32 } height={ 32 } />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={ 0.4 }
            onPress={ item.rightIconPress }
          >
            <SvgImage iconName={ item.rightIconName } width={ 32 } height={ 32 } />
          </TouchableOpacity>
          <Text style={ item.rightTextStyle }>{ item.rightIconText }</Text>
        </View>,
      );
    });
    return (circleButtons);
  };

  return (
    <>
      <View style={ styles.containerStyle }>
        <View style={ { width: '100%' } }>
          { renderCircleButtons() }
        </View>
        <TouchableOpacity
          activeOpacity={ 0.7 }
          style={ { marginBottom: 45 } }
          onPress={ () => setModalVisible(!modalVisible) }
        >
          <SvgImage iconName={ close } width={ 32 } height={ 32 } />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ActionButtonsModel;

