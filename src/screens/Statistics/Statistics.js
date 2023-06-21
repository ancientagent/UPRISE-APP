/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, Platform, ActivityIndicator, FlatList, ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-virtualized-view';
import _ from 'lodash';
import styles from './Statistics.styles';
import {
  getUserStatistics, getRadioStationStatistics,
  getEventsStatistics, getGenresPrefrenceStatistics,
  getBandsStatistics, getPopularArtistStatistics,
  getPopularArtistGenresStatistics,
} from '../../state/selectors/UserProfile';
import {
  getPopularArtistStatisticsSagaAction,
  getPopularArtistGenresStatisticsSagaAction,
  getUserStatisticsSagaAction,
  getEventsStatisticsSagaAction,
  getGenresPrefrenceStatisticsSagaAction,
  getBandsStatisticsSagaAction,
  getRadioStationStatisticsSagaAction,
} from '../../state/actions/sagas';
import Colors from '../../theme/colors';
import URLineChart from '../../components/URLineChart/URLineChart';
import URPieChat from '../../components/URPieChat/URPieChat';
import { genrePreferencePieChartColor } from '../../utilities/utilities';
import { strings } from '../../utilities/localization/localization';

const Statistics = () => {
  const dispatch = useDispatch();
  const userStatistics = useSelector(getUserStatistics);
  const RadioStationStatisticsData = useSelector(getRadioStationStatistics);
  const getEventsStatisticsData = useSelector(getEventsStatistics);
  const getBandsStatisticsData = useSelector(getBandsStatistics);
  const getGenresPrefrenceStatisticsData = useSelector(getGenresPrefrenceStatistics);
  const getPopularArtistStatisticsData = useSelector(getPopularArtistStatistics);
  const getPopularArtistGenresStatisticsData = useSelector(getPopularArtistGenresStatistics);
  const [bandsXData, setBandsXData] = useState();
  const [bandsYData, setBandsYData] = useState();
  const [eventXData, setEventXData] = useState();
  const [eventYData, setEventYData] = useState();
  const [genrePreferencePieChatData, setGenrePreferencePieChatData] = useState();
  const userStatisticsData = _.map(userStatistics, (data, index) => ({ ...data, count: parseInt(data.count), color: index === 0 ? '#165D73' : '#1AA4CF' }));
  useEffect(() => {
    /* add key:value in array */
    const modifiedData = _.map(getGenresPrefrenceStatisticsData, (data, index) => ({
      ...data, name: data.genre, count: parseFloat(data.sum), color: genrePreferencePieChartColor[index],
    }));
    const EventXaxisData = _.map(getEventsStatisticsData.months, (data, index) => ((index + 1) % 2 === 0 ? '' : data));
    /* key name change in array */
    // const modifiedData = getGenresPrefrenceStatisticsData.map((item, index) => {
    //   const { genre: name, sum: count } = item;
    //   return { name, count, color: genrePreferencePieChartColor[index] };
    // });
    setGenrePreferencePieChatData(modifiedData);
    setEventXData(EventXaxisData);
    setEventYData(getEventsStatisticsData.data);
    setBandsXData(getBandsStatisticsData.months);
    setBandsYData(getBandsStatisticsData.data);
  }, [getEventsStatisticsData, getBandsStatisticsData, getGenresPrefrenceStatisticsData]);
  useEffect(() => {
    dispatch(getRadioStationStatisticsSagaAction());
    dispatch(getPopularArtistStatisticsSagaAction());
    dispatch(getGenresPrefrenceStatisticsSagaAction());
    dispatch(getPopularArtistGenresStatisticsSagaAction());
    dispatch(getUserStatisticsSagaAction());
    dispatch(getEventsStatisticsSagaAction());
    dispatch(getBandsStatisticsSagaAction());
  }, []);
  const showLoading = useSelector(state => state.getEventsStatistics.isWaiting
    || state.getUserStatistics.isWaiting || state.getRadioStationStatistics.isWaiting
    || state.getBandsStatistics.isWaiting || state.getGenresPrefrenceStatistics.isWaiting
    || state.getPopularArtistStatistics.isWaiting || state.getPopularArtistGenresStatistics.isWaiting);

  const isEmptyData = (userStatisticsData && userStatisticsData.length < 1)
  && RadioStationStatisticsData === null && (genrePreferencePieChatData
    && genrePreferencePieChatData.length < 1)
    && (getPopularArtistGenresStatisticsData && getPopularArtistGenresStatisticsData.length < 1)
    && getPopularArtistStatisticsData === null;

  const ListEmptyComponent = () => (
    <View style={ { alignItems: 'center' } }>
      <Image
        style={ styles.illustrationStyle }
        source={ require('../../../assets/images/Statistics_illustrations.png') }
      />
    </View>
  );

  const eventsLineChartData = {
    labels: eventXData,
    datasets: [
      {
        data: eventYData,
        strokeWidth: 1,
      },
    ],
  };
  const bandsLineChartData = {
    labels: bandsXData,
    datasets: [
      {
        data: bandsYData,
        strokeWidth: 1,
      },
    ],
  };
  const renderRadioStationCard = () => (
    <View style={ styles.renderRadioStationCardContainerStyle }>
      <Text style={ styles.radioStationText }>
        { strings('statistics.radioStation') }
      </Text>
      <View style={ styles.radioStationView }>
        <View style={ { flex: 1 } }>
          <View style={ styles.radioStationCircleView }>
            <View style={ styles.radioStationCircleRing1 }>
              <View style={ styles.radioStationCircleRing2 }>
                <View style={ styles.radioStationCircleRing3 }>
                  <View style={ styles.radioStationCircleRing4 }>
                    <View style={ styles.radioStationCircleRing5 }>
                      <Text style={ styles.countText }>
                        { RadioStationStatisticsData.count }
                      </Text>
                      <Text style={ styles.circleRadioStation }>
                        { strings('statistics.radioStation') }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={ styles.radioStationLocationView }>
          <Image
            style={ { height: 20, width: 20 } }
            source={ require('../../../assets/images/locationIcon.png') }
          />
          <Text style={ styles.radioStationLocationText }>
            { ' ' }
            { RadioStationStatisticsData.station }
          </Text>
        </View>
      </View>
    </View>
  );
  const renderPopularArtist = () => (
    <View style={ styles.popularArtistView }>
      <Text style={ styles.popularArtistText }>
        { strings('statistics.popularArtist') }
      </Text>
      <View style={ { flexDirection: 'row', marginBottom: 20 } }>
        <View style={ styles.popularArtistUserTextView }>
          <View style={ { marginLeft: 20 } }>
            <Text style={ styles.popularArtistUserText }>
              { getPopularArtistStatisticsData.userName }
            </Text>
          </View>
        </View>
        <View style={ {
          flex: 1,
          alignItems: 'center',
        } }
        >
          <Image
            style={ { height: 165, width: 173 } }
            source={ getPopularArtistStatisticsData.avatar ? { uri: getPopularArtistStatisticsData.avatar } : require('../../../assets/images/statisticsDefultUser.png') }
          />
        </View>
      </View>
    </View>
  );
  const renderPopularArtistGenres = () => (
    <View style={ styles.popularArtistGenresView }>
      <Text style={ styles.popularArtistGenresText }>
        { strings('statistics.popularArtistPerGenre') }
      </Text>
      <View style={ styles.artistGenresListView }>
        <FlatList
          data={ getPopularArtistGenresStatisticsData }
          numColumns={ 2 }
          renderItem={ ({ item }) => (
            <View style={ styles.imageBackgroundView }>
              <ImageBackground
                style={ styles.imageBackgroundStyle }
                source={ { uri: item.thumbnail } }
              >
                <View style={ styles.genresNameView }>
                  <Text style={ styles.genresNameTextStyle }>
                    { item.name }
                  </Text>
                </View>
              </ImageBackground>
              <Text style={ styles.genresArtistTextStyle }>
                { item.artist }
              </Text>
            </View>
          ) }
        />
      </View>
    </View>
  );
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
          (!isEmptyData && !showLoading)
            ? (
              <View style={ { paddingBottom: Platform.OS === 'ios' ? '32%' : '44%' } }>
                { userStatisticsData && userStatisticsData.length > 1 && (
                <URPieChat
                  title={ strings('statistics.users') }
                  pieChatData={ userStatisticsData }
                  isParcentage={ false }
                />
                ) }
                { ((eventXData && eventXData.length > 2) && (eventYData && eventYData.length > 2)
            && !(eventYData.every(element => element === 0))) && (
              <URLineChart
                title={ strings('statistics.eventsPerYear') }
                lineChartData={ eventsLineChartData }
                lineStrokeColor={ Colors.eventsLineStrokeColor }
              />
                ) }
                { genrePreferencePieChatData && genrePreferencePieChatData.length > 1 && (
                <URPieChat
                  title={ strings('statistics.genrePreference') }
                  pieChatData={ genrePreferencePieChatData }
                  isParcentage
                />
                ) }
                { ((bandsXData && bandsXData.length > 2) && (bandsYData && bandsYData.length > 2)
            && !(bandsYData.every(element => element === 0))) && (
            <URLineChart
              title={ strings('statistics.bands') }
              lineChartData={ bandsLineChartData }
              lineStrokeColor={ Colors.bandslineStrokeColor }
            />
                ) }
                { RadioStationStatisticsData !== null && renderRadioStationCard() }
                { getPopularArtistStatisticsData !== null && renderPopularArtist() }
                { getPopularArtistGenresStatisticsData && getPopularArtistGenresStatisticsData.length >= 1
                && renderPopularArtistGenres() }
              </View>
            ) : ListEmptyComponent()
        ) }
    </ScrollView>
  );
};
export default Statistics;
