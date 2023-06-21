import React, { useState } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-elements';
import AsyncStorage
from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import URContainer from '../../components/URContainer/URContainer';
import Colors from '../../theme/colors';
import MiniPlayer from '../MiniPlayer/MiniPlayer';
import HomeTabs from './HomeTabs';
import CommonProfile from '../CommonProfile/CommonProfile';
import Loader from '../../components/Loader/Loader';

const Home = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.getUserDetails.isWaiting);
  const [selectedTabId, setSelectedTabId] = useState(1);
  const [playerState, setPlayerState] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const e = await AsyncStorage.getItem('onDemandPlayer');
        setPlayerState(e === 'active');
      }
      fetchData();
    }, [playerState]),
  );
  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ {
        height: '94%',
        justifyContent: 'space-between',
      } }
      >
        <View style={ playerState ? { height: '85%' } : null }>
          <CommonProfile navigation={ navigation } selectedTabId={ selectedTabId } />
          <MiniPlayer navigation={ navigation } />
          <Divider
            orientation='horizontal'
            width={ 0.4 }
            color={ Colors.dividerColor }
            style={ { marginTop: 14 } }
          />
          <HomeTabs navigation={ navigation } setSelectedTabId={ setSelectedTabId } />
        </View>
        <View style={ playerState ? {
          height: 150,
          backgroundColor: Colors.Black,
        } : null }
        />
      </View>
    </URContainer>
  );
};

export default Home;
