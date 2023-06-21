import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from 'react-native-elements';
import Colors from '../../../theme/colors';
import Members from '../Members/Members';
import {
  followingSagaAction, followingBandsSagaAction,
} from '../../../state/actions/sagas';
import { getUserDetails } from '../../../state/selectors/UserProfile';
import Bands from '../Bands/Bands';
import URHeaderContainer from '../../../components/URHeaderContainer/URHeaderContainer';
import styles from './Following.styles';

const Following = props => {
  const userDetails = useSelector(getUserDetails);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        dispatch(followingSagaAction());
        dispatch(followingBandsSagaAction(userDetails.id));
      }
      fetchData();
    }, []),
  );
  const { navigation } = props;
  const [selectedTab, setSelectedTab] = useState(1);
  const items = [{
    id: 1,
    title: 'Members',
  },
  {
    id: 2,
    title: 'Bands',
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
            style={ { marginTop: 5 } }
          />
        </TouchableOpacity>,
      );
    });
    return (toggleButtons);
  };
  const renderContaint = () => {
    if (selectedTab === 1) {
      return <Members navigation={ navigation } />;
    } else {
      return <Bands navigation={ navigation } />;
    }
  };
  return (
    <URHeaderContainer>
      <View style={ styles.FollowingViewStyle }>
        <View style={ { height: '80%' } }>
          <View style={ styles.toggleContainer }>
            { renderToggleButtons() }
          </View>
          <View style={ { height: '74%' } }>
            { renderContaint() }
          </View>
        </View>
        <View style={ {
          height: 150,
          backgroundColor: Colors.Black,
        } }
        />
      </View>
    </URHeaderContainer>
  );
};

export default Following;
