/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-virtualized-view';
import _ from 'lodash';
import URHeaderContainer from '../../components/URHeaderContainer/URHeaderContainer';
import SvgImage from '../../components/SvgImage/SvgImage';
import userAdd from '../../../assets/images/user-add.svg';
import blackUserAdd from '../../../assets/images/blackUserAdd.svg';
import BandDetailsTabs from './BandDetailsTabs/BandDetailsTabs';
import styles from './BandDetails.styles';
import bandVector from '../../../assets/images/bandVector.svg';
import {
  bandDetailsSagaAction,
  getBandSongListSagaAction,
  bandmembersLlistSagaAction,
  albumsListSagaAction,
  bandGallerySagaAction,
  undoBandFollowSagaAction,
  bandFollowSagaAction,
  bandEventsSagaAction,
} from '../../state/actions/sagas';
import {
  getBandDetailsList,
  getBandmembersLlist,
  getBandAlbumsList,
  getBandSongList,
  currentScreen,
} from '../../state/selectors/UserProfile';
import { strings } from '../../utilities/localization/localization';
import Loader from '../../components/Loader/Loader';

const BandDetails = ({ navigation, route }) => {
  const BandId = route.params.bandId;
  const dispatch = useDispatch();
  const BandData = useSelector(getBandDetailsList);
  const BandmembersLlist = useSelector(getBandmembersLlist);
  const BandAlbumsList = useSelector(getBandAlbumsList);
  const BandSongList = useSelector(getBandSongList);
  const screenData = useSelector(currentScreen);

  const showLoading = useSelector(state => state.bandDetails.isWaiting
    || state.bandmembersLlist.isWaiting || state.getBandSongList.isWaiting);
  const [followBtnStatus, setFollowBtnStatus] = useState(false);

  useEffect(() => {
    dispatch(bandDetailsSagaAction(BandId));
    dispatch(getBandSongListSagaAction(BandId));
    dispatch(bandmembersLlistSagaAction(BandId));
    // dispatch(albumsListSagaAction(BandId));
    dispatch(bandGallerySagaAction(BandId));
    dispatch(bandEventsSagaAction(BandId));
  }, [BandId]);

  useEffect(() => {
    setFollowBtnStatus(BandData.amiFollowingBand);
  }, [BandData]);

  const handleChange = id => {
    navigation.navigate('AlbumSongs', { albumId: id, bandId: BandData.id });
  };

  const renderMembersFlatList = renderData => (
    <View style={ { marginLeft: 10 } }>
      <FlatList
        horizontal
        data={ renderData }
        renderItem={ ({ item }) => (
          <TouchableOpacity
            activeOpacity={ 0.8 }
            onPress={ () => navigation.navigate({
              name: 'OtherProfile',
              params: {
                Listener: item.role.name !== 'artist', userName: item.userName, userId: item.id,
              },
            }) }
          >
            <View style={ styles.memberImageView }>
              <Image
                style={ styles.memberImageStyle }
                source={ item.avatar ? { uri: item.avatar } : require('../../../assets/images/users.png') }
              />
              <Text style={ styles.memberTextStyle }>
                { item.userName }
              </Text>
            </View>
          </TouchableOpacity>
        ) }
      />
    </View>
  );

  const renderAlbumsFlatList = renderData => (
    <View style={ { marginLeft: 20 } }>
      <FlatList
        horizontal
        data={ renderData }
        renderItem={ ({ item }) => (
          <TouchableOpacity
            activeOpacity={ 0.8 }
            onPress={ () => {
              handleChange(item.albumId);
            } }
          >
            <View style={ styles.albumsImageView }>
              <Image
                style={ styles.albumsImage }
                source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/album_default_img.png') }
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
            </View>
          </TouchableOpacity>
        ) }
      />
    </View>
  );
  const renderSongsFlatList = renderData => (
    <View style={ { marginLeft: 20 } }>
      <FlatList
        horizontal
        data={ renderData }
        renderItem={ ({ item }) => (
          <View style={ styles.albumsImageView }>
            <Image
              style={ styles.albumsImage }
              source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/music_default_img.png') }
            />
            <Text style={ styles.SongTextStyle } numberOfLines={ 1 } ellipsizeMode='tail'>
              { item.title }
            </Text>
          </View>
        ) }
      />
    </View>
  );
  const bandFollow = () => {
    setFollowBtnStatus(true);
    const payload = {
      bandId: BandData.id,
    };
    dispatch(bandFollowSagaAction(payload));
  };
  const undoBandFollow = () => {
    setFollowBtnStatus(false);
    const payload = {
      bandId: BandData.id,
    };
    dispatch(undoBandFollowSagaAction(payload));
  };
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.bandDetailsView }>
        <View style={ !screenData.ondemandPlayerClose && { height: '80%' } }>
          <ScrollView>
            <Image
              style={ styles.bandImage }
              source={ BandData.logo ? { uri: BandData.logo } : require('../../../assets/images/band_defult_img.png') }
            />
            <Text style={ styles.bandNameText }>
              Band Name:
            </Text>
            <View style={ styles.bandTitleView }>
              <Text style={ styles.bandTitle }>
                { BandData.title }
              </Text>
              { followBtnStatus
                ? (
                  <TouchableOpacity style={ styles.unfollowbtnView } onPress={ undoBandFollow }>
                    <View style={ styles.followbtn }>
                      <SvgImage iconName={ userAdd } width={ 12 } height={ 12 } />
                      <Text style={ styles.unfollowText }>
                        { strings('General.unFollow') }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
                : (
                  <TouchableOpacity style={ styles.followbtnView } onPress={ bandFollow }>
                    <View style={ styles.followbtn }>
                      <SvgImage iconName={ blackUserAdd } width={ 12 } height={ 12 } />
                      <Text style={ styles.followText }>
                        { strings('General.follow') }
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) }
            </View>
            <View style={ styles.membersView }>
              <Text style={ styles.membersText }>
                { strings('General.members') }
              </Text>
              { renderMembersFlatList(BandmembersLlist) }
            </View>
            { BandSongList.length > 0
          && (
          <View style={ { marginTop: 12 } }>
            <View style={ styles.AlbumsView }>
              <Text style={ styles.AlbumsText }>
                { strings('General.songs') }
              </Text>
              { BandSongList.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => navigation.navigate('AllBandSongs', { bandId: BandData.id }) }
              >
                { strings('General.seeAll') }
              </Text>
              ) }
            </View>
            { renderSongsFlatList(_.slice(BandSongList, 0, 10)) }
          </View>
          ) }
            { /* { BandAlbumsList.length > 0
          && (
          <View style={ { marginTop: 12 } }>
            <View style={ styles.AlbumsView }>
              <Text style={ styles.AlbumsText }>
                { strings('General.albums') }
              </Text>
              { BandAlbumsList.length > 10
              && (
              <Text
                style={ styles.seeallText }
                onPress={ () => navigation.navigate('AllAlbums', { bandId: BandData.id }) }
              >
                { strings('General.seeAll') }
              </Text>
              ) }
            </View>
            { renderAlbumsFlatList(_.slice(BandAlbumsList, 0, 10)) }
          </View>
          ) } */ }
            <View>
              <BandDetailsTabs navigation={ navigation } BandId={ BandId } />
            </View>
          </ScrollView>
        </View>
        <View style={ styles.miniPlayerView } />
      </View>
    </URHeaderContainer>
  );
};

export default BandDetails;
