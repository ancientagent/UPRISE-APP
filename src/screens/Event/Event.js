/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, Platform, ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Icon } from 'react-native-elements';
import MarqueeText from 'react-native-marquee';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Colors from '../../theme/colors';
import bandVector from '../../../assets/images/bandVector.svg';
import location from '../../../assets/images/location_on.svg';
import regularcalendar from '../../../assets/images/regularcalendar.svg';
import SvgImage from '../../components/SvgImage/SvgImage';
import styles from './Event.styles';
import clock from '../../../assets/images/clock.svg';
import {
  getHomeEvents,
} from '../../state/selectors/UserProfile';
import {
  homeEventsSagaAction, googleEventSagaAction, removeEventSagaAction,
} from '../../state/actions/sagas';
import { strings } from '../../utilities/localization/localization';

const Event = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const EventData = useSelector(getHomeEvents);
  const [EventList, setEventList] = useState(EventData);
  const showLoading = useSelector(state => state.homeEvents.isWaiting);
  useEffect(() => {
    dispatch(homeEventsSagaAction());
  }, []);
  useEffect(() => {
    setEventList(EventData);
  }, [EventData]);
  const ListEmptyComponent = () => (
    <View style={ { alignItems: 'center' } }>
      <Text style={ styles.emptyTxt }>
        { strings('Event.emptyEvent') }
      </Text>
      <Image
        style={ styles.illustrationStyle }
        source={ require('../../../assets/images/Events_illustration.png') }
      />
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
          <View style={ { paddingBottom: Platform.OS === 'ios' ? '25%' : '30%' } }>
            { EventData.length === 0 && !showLoading
              ? ListEmptyComponent()
              : (
                <FlatList
                  data={ EventList }
                  renderItem={ ({ item }) => (
                    <View style={ styles.eventView }>
                      <Image
                        style={ styles.eventImage }
                        source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/images/event.png') }
                      />
                      <View style={ { marginHorizontal: 10 } }>
                        <View style={ styles.eventTextView }>
                          <MarqueeText
                            speed={ 0.2 }
                            marqueeOnStart
                            loop
                            style={ !(item.startTime >= moment.utc(new Date()).format()) ? { width: '100%' } : { width: '60%' } }
                            delay={ 1000 }
                          >
                            <Text style={ styles.eventText } numberOfLines={ 1 }>
                              { item.eventName }
                            </Text>
                          </MarqueeText>
                          { item.startTime >= moment.utc(new Date()).format()
                  && (
                  <>
                    { item.addToCalender ? (
                      <TouchableOpacity
                        style={ styles.calendarBtnView }
                        onPress={ () => {
                          setEventList(prevState => {
                            const newState = prevState.map(obj => {
                              if (obj.id === item.id) {
                                return { ...obj, addToCalender: false };
                              }
                              return obj;
                            });

                            return newState;
                          });
                          dispatch(removeEventSagaAction(item.id));
                        } }
                      >
                        <View style={ styles.addCalendarBtnContainerStyle }>
                          <Icon
                            type='ionicon'
                            name='checkmark-outline'
                            size={ 11 }
                            color={ Colors.White }
                          />
                          <Text style={ styles.addCalendarBtnText }>
                            { strings('General.addedToCalendar') }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                      : (
                        <TouchableOpacity
                          style={ styles.calendarBtnView }
                          onPress={ () => {
                            setEventList(prevState => {
                              const newState = prevState.map(obj => {
                                if (obj.id === item.id) {
                                  return { ...obj, addToCalender: true };
                                }
                                return obj;
                              });

                              return newState;
                            });
                            dispatch(googleEventSagaAction(item.id));
                          } }
                        >
                          <Text style={ styles.calendarBtnText }>
                            { strings('General.addToCalendar') }
                          </Text>
                        </TouchableOpacity>
                      ) }
                  </>
                  ) }
                        </View>
                        <View style={ styles.containtView }>
                          <SvgImage
                            iconName={ bandVector }
                            iconStyle={ { marginRight: 3 } }
                            width={ 14 }
                            height={ 14 }
                          />
                          <TouchableOpacity onPress={ () => navigation.navigate('BandDetails', { bandId: item.band.id }) }>
                            <Text style={ styles.bandNameHeadeing }>
                              { item.band.title }
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {
                      (item && item.description) ? (
                        <Text style={ styles.bandSubText }>
                          <Text style={ styles.bandText }>
                            { strings('Event.description') }
                          </Text>
                          { item.description }
                        </Text>
                      ) : <View />
                    }
                        <View style={ { marginRight: 16 } }>
                          <View style={ styles.eventDetailsTextView }>
                            <SvgImage iconName={ location } width={ 14 } height={ 14 } iconStyle={ { marginTop: 6 } } />
                            <Text style={ styles.eventDetailsText }>
                              { item.location }
                            </Text>
                          </View>
                          <View style={ styles.eventDetailsTextView }>
                            <SvgImage iconName={ clock } width={ 14 } height={ 14 } iconStyle={ { marginTop: 6 } } />
                            <Text style={ styles.eventDetailsText }>
                              { new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                              { ' ' }
                              { strings('General.onwards') }
                            </Text>
                          </View>
                          <View style={ styles.eventDetailsTextView }>
                            <SvgImage
                              iconName={ regularcalendar }
                              width={ 14 }
                              height={ 14 }
                              iconStyle={ { marginTop: 6 } }
                            />
                            <Text style={ styles.eventDetailsText }>
                              { new Date(item.startTime).toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                              }) }
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) }
                  keyExtractor={ item => item.id }
                />
              ) }
          </View>
        ) }
    </ScrollView>
  );
};
export default Event;
