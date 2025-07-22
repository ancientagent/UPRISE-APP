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
import { currentScreen, accessToken } from '../../state/selectors/UserProfile';
import { getUserGenresSagaAction } from '../../state/actions/sagas';
import { currentScreenAction } from '../../state/actions/currentScreen/currentScreen.action';

const HomeTabs = props => {
  const { navigation, setSelectedTabId } = props;
  const dispatch = useDispatch();
  const screenData = useSelector(currentScreen);
  const userAccessToken = useSelector(accessToken);
  const [selectedTab, setSelectedTab] = useState(screenData.selectedTabId);
  
  console.log('--- HOME TABS: Component rendered ---');
  console.log('--- HOME TABS: screenData ---', screenData);
  console.log('--- HOME TABS: selectedTab ---', selectedTab);
  
  useEffect(() => {
    console.log('--- HOME TABS: useEffect triggered - dispatching getUserGenresSagaAction ---');
    if (userAccessToken) {
      console.log('--- HOME TABS: Dispatching getUserGenresSagaAction with accessToken ---');
      dispatch(getUserGenresSagaAction({ accessToken: userAccessToken }));
    } else {
      console.log('--- HOME TABS: No accessToken available, skipping getUserGenresSagaAction ---');
    }
  }, [dispatch, userAccessToken]);
  
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
    console.log('--- HOME TABS: renderContaint called with selectedTab ---', selectedTab);
    
    if (selectedTab === 1) {
      console.log('--- HOME TABS: Rendering Feed component ---');
      return <Feed navigation={ navigation } />;
    } else if (selectedTab === 2) {
      console.log('--- HOME TABS: Rendering Events component ---');
      return <Events navigation={ navigation } />;
    } else if (selectedTab === 3) {
      console.log('--- HOME TABS: Rendering Promos component ---');
      return <Promos navigation={ navigation } />;
    } else {
      console.log('--- HOME TABS: Rendering Statistics component ---');
      return <Statistics navigation={ navigation } />;
    }
  };
  
  const renderToggleButtons = () => (
    _.map(items, item => (
      <Chip
        key={item.id}
        title={ item.title }
        TouchableComponent={ TouchableOpacity }
        type={ item.id === selectedTab ? 'solid' : 'outline' }
        onPress={ () => {
          console.log('--- HOME TABS: Tab pressed ---', item.title, 'ID:', item.id);
          setSelectedTab(item.id);
          setSelectedTabId(item.id);
          dispatch(currentScreenAction({ ...screenData, selectedTabId: parseInt(item.id) }));
          console.log('--- HOME TABS: Tab changed to ---', item.title);
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
  
  console.log('--- HOME TABS: Rendering component ---');
  
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
