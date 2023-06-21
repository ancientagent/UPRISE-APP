/* eslint-disable global-require */
import React from 'react';
import {
  View, Text, Image,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import location from '../../../../assets/images/location_on.svg';
import clock from '../../../../assets/images/clock.svg';
import SvgImage from '../../../components/SvgImage/SvgImage';
import styles from './EventTab.styles';
import regularcalendar from '../../../../assets/images/regularcalendar.svg';
import {
  getBandEvents,
} from '../../../state/selectors/UserProfile';
import { strings } from '../../../utilities/localization/localization';

const EventTab = ({ navigation }) => {
  const BandEvents = useSelector(getBandEvents);
  return (
    <View style={ styles.galleryTabView }>
      { BandEvents.length === 0
        ? (
          <Text style={ styles.eventTxt }>
            { strings('bandDetails.noEvent') }
          </Text>
        )
        : (
          <FlatGrid
            maxItemsPerRow={ 1 }
            itemContainerStyle={ styles.gridView }
            data={ _.slice(BandEvents, 0, 2) }
            keyExtractor={ item => item.id }
            renderItem={ ({ item }) => (
              <>
                <Image
                  style={ styles.gridImage }
                  source={ item.thumbnail ? { uri: item.thumbnail } : require('../../../../assets/images/event.png') }
                />
                <Text style={ styles.textStyle }>{ item.eventName }</Text>
                <View style={ { marginRight: 16 } }>
                  <View style={ styles.eventDetailsTextView }>
                    <SvgImage iconName={ location } width={ 14 } height={ 14 } iconStyle={ { marginTop: 2 } } />
                    <Text style={ styles.eventDetailsText }>
                      { item.location }
                    </Text>
                  </View>
                  <View style={ styles.eventDetailsTextView }>
                    <SvgImage iconName={ clock } width={ 14 } height={ 14 } iconStyle={ { marginTop: 2 } } />
                    <Text style={ styles.eventDetailsText }>
                      { new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                      { ' ' }
                      { strings('General.onwards') }
                    </Text>
                  </View>
                  <View style={ styles.eventDetailsTextView }>
                    <SvgImage iconName={ regularcalendar } width={ 14 } height={ 14 } iconStyle={ { marginTop: 2 } } />
                    <Text style={ styles.eventDetailsText }>
                      { new Date(item.endTime).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      }) }
                    </Text>
                  </View>
                </View>
              </>
            ) }
          />
        ) }
      { BandEvents.length > 2
      && (
      <Text style={ styles.seeMoreText } onPress={ () => navigation.navigate('FullEventView') }>
        { strings('General.seeMore') }
      </Text>
      ) }
    </View>
  );
};
export default EventTab;
