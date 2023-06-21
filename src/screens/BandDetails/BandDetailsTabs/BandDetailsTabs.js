import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { Divider } from 'react-native-elements';
import Colors from '../../../theme/colors';
import EventTab from '../EventTab/EventTab';
import GalleryTab from '../GalleryTab/GalleryTab';

const BandDetailsTabs = props => {
  const { navigation, BandId } = props;
  const [selectedTab, setSelectedTab] = useState(1);
  const items = [{
    id: 1,
    title: 'Gallery',
  },
  {
    id: 2,
    title: 'Events',
  },
  ];
  const renderToggleButtons = () => {
    const toggleButtons = [];
    _.forEach(items, item => {
      toggleButtons.push(
        <TouchableOpacity
          onPress={ () => {
            setSelectedTab(item.id);
          } }
        >
          <Text style={ item.id === selectedTab ? styles.focusedStyle : styles.unfocusedStyle }>
            { item.title }
          </Text>
          <Divider
            orientation='horizontal'
            width={ 2 }
            color={ item.id === selectedTab ? Colors.URbtnColor : Colors.transparentColor }
          />
        </TouchableOpacity>,
      );
    });
    return (toggleButtons);
  };
  const renderContaint = () => {
    if (selectedTab === 1) {
      return <GalleryTab navigation={ navigation } BandId={ BandId } />;
    } else {
      return <EventTab navigation={ navigation } />;
    }
  };
  return (
    <View style={ { marginTop: 10 } }>
      <View style={ styles.toggleBtnView }>
        { renderToggleButtons() }
      </View>
      { renderContaint() }
    </View>
  );
};

const styles = StyleSheet.create({
  toggleBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  focusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.URbtnColor,
  },
  unfocusedStyle: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 16,
    width: 150,
    textAlign: 'center',
    paddingVertical: 6,
    color: Colors.sideHeadingText,
  },
});
export default BandDetailsTabs;
