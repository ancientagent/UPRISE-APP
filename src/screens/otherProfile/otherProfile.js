/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { useDispatch, useSelector } from 'react-redux';
import styles from './otherProfile.styles';
import URHeaderContainer from '../../components/URHeaderContainer/URHeaderContainer';
import SvgImage from '../../components/SvgImage/SvgImage';
import userAdd from '../../../assets/images/user-add.svg';
import Colors from '../../theme/colors';
import blackUserAdd from '../../../assets/images/blackUserAdd.svg';
import {
  otherUserProfileSagaAction,
  unFollowSagaAction,
  followSagaAction,
  undoBandFollowSagaAction,
  bandFollowSagaAction,
  followingBandsSagaAction,
} from '../../state/actions/sagas';
import {
  getOtherUserData, getFollowingBands, getUserDetails, currentScreen,
} from '../../state/selectors/UserProfile';
import { strings } from '../../utilities/localization/localization';
import Loader from '../../components/Loader/Loader';

const OtherProfile = ({ route, navigation }) => {
  const userInfo = route.params.Listener;
  const { userId } = route.params;

  const [isListener, setListener] = useState(userInfo);
  const [followBtnStatus, setFollowBtnStatus] = useState();
  const [bandFollowBtn, setBandFollowBtn] = useState();
  const dispatch = useDispatch();
  const showLoading = useSelector(state => state.getUserDetails.isWaiting
    || state.followingBands.isWaiting || state.otherUserProfile.isWaiting);
  const OtherUserData = useSelector(getOtherUserData);
  const bandList = useSelector(getFollowingBands);
  const userData = useSelector(getUserDetails);
  const screenData = useSelector(currentScreen);
  useEffect(() => {
    dispatch(otherUserProfileSagaAction(userId));
    dispatch(followingBandsSagaAction(userId));
  }, [userId]);

  useEffect(() => {
    setFollowBtnStatus(OtherUserData.iamFollowing);
    setBandFollowBtn(OtherUserData.iamFollowingBand);
  }, [OtherUserData]);

  const handleChange = item => {
    navigation.navigate('BandDetails', { bandId: item.bandId });
  };

  const renderBandFlatList = renderData => (
    <View style={ { marginLeft: 20 } }>
      <FlatList
        horizontal
        data={ renderData }
        renderItem={ ({ item }) => (
          <TouchableOpacity
            activeOpacity={ 0.8 }
            onPress={ () => {
              handleChange(item);
            } }
          >
            <View style={ styles.membersImageView }>
              <Image
                style={ styles.membersImageStyle }
                source={ item.logo ? { uri: item.logo } : require('../../../assets/images/band_img.png') }
              />
              <Text style={ styles.membersText }>{ item.title }</Text>
            </View>
          </TouchableOpacity>
        ) }
      />
    </View>
  );
  const Follow = () => {
    setFollowBtnStatus(true);
    const payload = {
      followeeId: OtherUserData.id,
    };
    dispatch(followSagaAction(payload));
  };
  const undoFollow = () => {
    setFollowBtnStatus(false);
    const payload = {
      followeeId: OtherUserData.id,
    };
    dispatch(unFollowSagaAction(payload));
  };
  const bandFollow = () => {
    setBandFollowBtn(true);
    const payload = {
      bandId: OtherUserData.band.id,
    };
    dispatch(bandFollowSagaAction(payload));
  };
  const undoBandFollow = () => {
    setBandFollowBtn(false);
    const payload = {
      bandId: OtherUserData.band.id,
    };
    dispatch(undoBandFollowSagaAction(payload));
  };
  return (
    <URHeaderContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.container }>
        <View style={ !screenData.ondemandPlayerClose && { height: '85%' } }>
          <ScrollView>
            <View style={ styles.profileImageView }>
              <Image
                source={ OtherUserData.avatar ? { uri: OtherUserData.avatar } : require('../../../assets/images/users.png') }
                style={ styles.profileImage }
              />
              <Text style={ styles.profileName }>
                { OtherUserData.userName }
              </Text>
              { isListener && !(userData.id === userId) && (
              <>
                { followBtnStatus
                  ? (
                    <TouchableOpacity style={ styles.unfollowBtnView } onPress={ undoFollow }>
                      <View style={ styles.followBtn }>
                        <SvgImage iconName={ userAdd } width={ 12 } height={ 12 } />
                        <Text style={ styles.unfollowText }>
                          { strings('General.unFollow') }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                  : (
                    <TouchableOpacity style={ styles.followBtnView } onPress={ Follow }>
                      <View style={ styles.followBtn }>
                        <SvgImage iconName={ blackUserAdd } width={ 12 } height={ 12 } />
                        <Text style={ styles.followText }>
                          { strings('General.follow') }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) }
              </>
              ) }
              { !isListener && (
              <TouchableOpacity
                style={ { marginHorizontal: 24 } }
                onPress={ () => navigation.navigate('BandDetails', { bandId: OtherUserData.band.id }) }
              >
                <Text style={ styles.appearsText }>
                  { strings('otherProfile.appearsBand') }
                </Text>
                <View style={ styles.promosView }>
                  <Image
                    style={ styles.promosImage }
                    source={ OtherUserData.band && OtherUserData.band.logo ? { uri: OtherUserData.band.logo } : require('../../../assets/images/band_defult_img.png') }
                  />
                  <View style={ styles.bandNameView }>
                    <Text style={ styles.promosText }>
                      { OtherUserData.band && OtherUserData.band.title }
                    </Text>
                    { bandFollowBtn ? (
                      <TouchableOpacity style={ styles.unfollowbtn } onPress={ undoBandFollow }>
                        <View style={ styles.followBtn }>
                          <SvgImage iconName={ userAdd } width={ 12 } height={ 12 } />
                          <Text style={ styles.unfollowText }>
                            { strings('General.unFollow') }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                      : (
                        <TouchableOpacity style={ styles.btnView } onPress={ bandFollow }>
                          <View style={ styles.followBtn }>
                            <SvgImage iconName={ blackUserAdd } width={ 12 } height={ 12 } />
                            <Text style={ styles.followText }>
                              { strings('General.follow') }
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) }
                  </View>
                </View>
              </TouchableOpacity>
              ) }
              { bandList.length > 0 && (
              <View>
                <View style={ styles.bandListView }>
                  <Text style={ styles.BandList }>
                    { strings('otherProfile.bandList') }
                  </Text>
                  { bandList.length > 10
              && (
                <Text style={ styles.seeallText } onPress={ () => navigation.navigate('AllBandList') }>
                  { strings('General.seeAll') }
                </Text>
              ) }
                </View>
                { renderBandFlatList(bandList) }
              </View>
              ) }
              <View style={ { marginHorizontal: 24 } }>
                <Text style={ styles.socialPlatform }>
                  { strings('socialPlatform.socialPlatform') }
                </Text>
                <Text style={ styles.socialPlatformTitle }>
                  { strings('socialPlatform.facebook') }
                </Text>
                <Text style={ styles.socialPlatformUserId }>
                  { OtherUserData.facebook }
                </Text>
                <Divider
                  orientation='horizontal'
                  width={ 1 }
                  color={ Colors.dividerColor }
                />
                <Text style={ styles.socialPlatformTitle }>
                  { strings('socialPlatform.instagram') }
                </Text>
                <Text style={ styles.socialPlatformUserId }>
                  { OtherUserData.instagram }
                </Text>
                <Divider
                  orientation='horizontal'
                  width={ 1 }
                  color={ Colors.dividerColor }
                />
                <Text style={ styles.socialPlatformTitle }>
                  { strings('socialPlatform.twitter') }
                </Text>
                <Text style={ styles.socialPlatformUserId }>
                  { OtherUserData.twitter }
                </Text>
                <Divider
                  orientation='horizontal'
                  width={ 1 }
                  color={ Colors.dividerColor }
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={ styles.miniPlayerView } />
      </View>
    </URHeaderContainer>
  );
};

export default OtherProfile;
