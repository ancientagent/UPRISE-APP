import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer, { useProgress } from 'react-native-track-player';
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
import { getRadioSong } from '../../state/selectors/UserProfile';
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
  const progress = useProgress();
  const [blastState, setBlastState] = useState(songData.isSongBlasted);
  const [followState, setFollowState] = useState(songData.amIFollowingBand);
  const [songReport, setSongReport] = useState(songData.isSongReport);
  const [upVoteStatus, setUpVoteStatus] = useState(songData.isSongUpvote);
  const [downVoteStatus, setDownVoteStatus] = useState(songData.isSongDownvote);

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
    leftBtnStyle: styles.downUpvoteBtnSet.leftBtnStyle,
    leftIconName: downVoteStatus ? disableDownvote : Downvote,
    leftIconPress: () => (downVoteStatus ? songundoDownVote() : songDownVote()),
    rightIconPress: () => (upVoteStatus ? songundoUpvote() : songUpvote()),
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
    };
    dispatch(songVoteSagaAction(payload));
  };
  const songDownVote = () => {
    setUpVoteStatus(false);
    setDownVoteStatus(!downVoteStatus);
    const payload = {
      songId: songData.songId,
      type: 'downvote',
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
  const songBlast = () => {
    setBlastState(true);
    const payload = {
      songId: songData.songId,
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

