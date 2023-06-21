import React, {
  useEffect, useCallback, useMemo, useState,
} from 'react';
import { ScrollView } from 'react-native-virtualized-view';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import {
  Calendar,
} from 'react-native-calendars';
import _ from 'lodash';
import styles from './Events.style';
import Colors from '../../theme/colors';
import { getGoogleEventSagaAction, getDayEventSagaAction } from '../../state/actions/sagas';
import { getGoogleEvent, getDayEvent } from '../../state/selectors/UserProfile';
import { strings } from '../../utilities/localization/localization';
import Loader from '../../components/Loader/Loader';

const Events = () => {
  const INITIAL_DATE = moment().format('YYYY-MM-DD');
  const dispatch = useDispatch();
  const showLoading = useSelector(state => state.getDayEvent.isWaiting);
  const eventDetails = useSelector(getDayEvent);
  const [selected, setSelected] = useState(INITIAL_DATE);

  const marked = useMemo(() => ({
    [selected]: {
      selected: true,
      selectedColor: Colors.URbtnColor,
      selectedTextColor: Colors.Black,
    },
  }), [selected]);
  const eventData = useSelector(getGoogleEvent);
  useEffect(() => {
    dispatch(getDayEventSagaAction(INITIAL_DATE));
    dispatch(getGoogleEventSagaAction());
  }, []);
  const object = _.reduce(eventData,
    (data, value) => ({ ...data, [value]: { marked: true, selected: selected === value } }), {});
  const onDayPress = useCallback(day => {
    setSelected(day.dateString);
    dispatch(getDayEventSagaAction(day.dateString));
  }, []);
  const calendarView = () => (
    <Calendar
      markedDates={ Object.assign(marked, object) }
      onDayPress={ onDayPress }
      current={ selected }
      theme={ {
        dotStyle: styles.calDotStyle,
        calendarBackground: 'transparent',
        selectedDayBackgroundColor: Colors.URbtnColor,
        selectedDayTextColor: Colors.Black,
        todayTextColor: Colors.URbtnColor,
        dayTextColor: Colors.White,
        textDisabledColor: Colors.sideHeadingText,
        dotColor: Colors.URbtnColor,
        selectedDotColor: Colors.Black,
        arrowColor: Colors.White,
        disabledArrowColor: Colors.sideHeadingText,
        monthTextColor: Colors.White,
        textDayFontFamily: 'Oswald Medium',
        textMonthFontFamily: 'Oswald Medium',
        textDayHeaderFontFamily: 'Oswald Medium',
        textDayFontWeight: '500',
        textMonthFontWeight: '500',
        textDayHeaderFontWeight: '500',
        textDayFontSize: 12,
        textMonthFontSize: 20,
        textDayHeaderFontSize: 13,
      } }
    />
  );
  return (
    <ScrollView style={ styles.agendaContainer }>
      <Loader
        visible={ showLoading }
      />
      <View>
        { calendarView() }
        { eventDetails.length === 0 && !showLoading
          ? (
            <>
              <View style={ styles.itemContainer }>
                <View style={ styles.itemContainerView }>
                  <Text style={ styles.eventTxt }>
                    { strings('Event.scheduled') }
                  </Text>
                </View>
              </View>
            </>
          )
          : (
            <FlatList
              data={ eventDetails }
              renderItem={ ({ item }) => (
                <View style={ styles.itemContainer }>
                  <View style={ styles.itemContainerView }>
                    <View style={ styles.timeContainer }>
                      <View style={ styles.dotStyle } />
                      <Text style={ styles.timeTxtStyle }>
                        { new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                      </Text>
                    </View>
                    <Text style={ styles.eventName }>{ item.eventName }</Text>
                    <Text style={ styles.location }>{ item.location }</Text>
                  </View>
                </View>
              ) }
            />
          ) }
      </View>
    </ScrollView>
  );
};
export default Events;
