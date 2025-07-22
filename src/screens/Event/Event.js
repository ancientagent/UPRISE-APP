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
  
  console.log('--- EVENTS COMPONENT: Component rendered ---');
  console.log('--- EVENTS COMPONENT: EventData from Redux ---', EventData);
  console.log('--- EVENTS COMPONENT: EventData length ---', EventData?.length || 0);
  console.log('--- EVENTS COMPONENT: EventData type ---', typeof EventData);
  console.log('--- EVENTS COMPONENT: EventData is array ---', Array.isArray(EventData));
  console.log('--- EVENTS COMPONENT: showLoading ---', showLoading);
  console.log('--- EVENTS COMPONENT: EventList state ---', EventList);
  console.log('--- EVENTS COMPONENT: EventList length ---', EventList?.length || 0);
  
  // Log Redux state details
  const fullReduxState = useSelector(state => state.homeEvents);
  console.log('--- EVENTS COMPONENT: Full Redux state ---', fullReduxState);
  console.log('--- EVENTS COMPONENT: Redux state isWaiting ---', fullReduxState?.isWaiting);
  console.log('--- EVENTS COMPONENT: Redux state error ---', fullReduxState?.error);
  console.log('--- EVENTS COMPONENT: Redux state data ---', fullReduxState?.data);
  
  useEffect(() => {
    console.log('--- EVENTS COMPONENT: useEffect triggered - dispatching homeEventsSagaAction ---');
    console.log('--- EVENTS COMPONENT: About to dispatch homeEventsSagaAction ---');
    dispatch(homeEventsSagaAction());
    console.log('--- EVENTS COMPONENT: homeEventsSagaAction dispatched ---');
  }, []);
  
  useEffect(() => {
    console.log('--- EVENTS COMPONENT: EventData changed, updating EventList ---');
    console.log('--- EVENTS COMPONENT: Previous EventList ---', EventList);
    console.log('--- EVENTS COMPONENT: New EventData ---', EventData);
    console.log('--- EVENTS COMPONENT: EventData changed from ---', EventList?.length || 0, 'to', EventData?.length || 0);
    setEventList(EventData);
    console.log('--- EVENTS COMPONENT: EventList updated ---');
  }, [EventData]);
  
  const ListEmptyComponent = () => {
    console.log('--- EVENTS COMPONENT: Rendering ListEmptyComponent ---');
    return (
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
  };
  
  console.log('--- EVENTS COMPONENT: Rendering component ---');
  console.log('--- EVENTS COMPONENT: EventData.length === 0 ---', EventData.length === 0);
  console.log('--- EVENTS COMPONENT: !showLoading ---', !showLoading);
  console.log('--- EVENTS COMPONENT: Will show empty component ---', EventData.length === 0 && !showLoading);
  console.log('--- EVENTS COMPONENT: Will show loading ---', showLoading);
  console.log('--- EVENTS COMPONENT: Will show FlatList ---', EventData.length > 0 && !showLoading);
  
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
