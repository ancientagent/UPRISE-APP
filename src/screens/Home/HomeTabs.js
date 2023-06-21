/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  View, TouchableOpacity, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import {
  Chip,
} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../theme/colors';
import Statistics from '../Statistics/Statistics';
import Promos from '../Promos/Promos';
import Feed from '../Feed/Feed';
import Events from '../Event/Event';
import { currentScreen } from '../../state/selectors/UserProfile';
import { getUserGenresSagaAction } from '../../state/actions/sagas';
import { currentScreenAction } from '../../state/actions/currentScreen/currentScreen.action';

const HomeTabs = props => {
  const { navigation, setSelectedTabId } = props;
  const dispatch = useDispatch();
  const screenData = useSelector(currentScreen);
  const [selectedTab, setSelectedTab] = useState(screenData.selectedTabId);
  useEffect(() => {
    dispatch(getUserGenresSagaAction());
  }, []);
  const items = [{
    id: 1,
    title: 'Feed',
  },
  {
    id: 2,
    title: 'Events',
  },
  {
    id: 3,
    title: 'Promos',
  },
  {
    id: 4,
    title: 'Statistics',
  },
  ];

  const renderContaint = () => {
    if (selectedTab === 1) {
      return <Feed navigation={ navigation } />;
    } else if (selectedTab === 2) {
      return <Events navigation={ navigation } />;
    } else if (selectedTab === 3) {
      return <Promos navigation={ navigation } />;
    } else {
      return <Statistics navigation={ navigation } />;
    }
  };
  const renderToggleButtons = () => (
    _.map(items, item => (
      <Chip
        title={ item.title }
        TouchableComponent={ TouchableOpacity }
        type={ item.id === selectedTab ? 'solid' : 'outline' }
        onPress={ () => {
          setSelectedTab(item.id);
          setSelectedTabId(item.id);
          dispatch(currentScreenAction({ ...screenData, selectedTabId: parseInt(item.id) }));
        } }
        buttonStyle={ [
          styles.buttonStyle,
          { backgroundColor: item.id === selectedTab ? Colors.URbtnBgColor : Colors.labelBgColor },
        ] }
        titleStyle={ [styles.titleStyle,
          { color: item.id === selectedTab ? Colors.radiumColour : Colors.labelColor }] }
      />
    ))
  );
  return (
    <View style={ { height: '100%' } }>
      <View style={ styles.conatiner }>
        { renderToggleButtons() }
      </View>
      <View style={ { height: '50%' } }>
        { renderContaint() }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  buttonStyle: {
    borderColor: 'transparent',
    width: 80,
    padding: 0,
    color: Colors.URbtnColor,
  },
  titleStyle: {
    fontWeight: '400',
    fontFamily: 'Oswald Regular',
    fontSize: 14,
    paddingTop: 1,
    paddingBottom: 3,
  },
});

export default HomeTabs;
