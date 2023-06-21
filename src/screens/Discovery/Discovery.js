import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import URContainer from '../../components/URContainer/URContainer';
import CommonProfile from '../CommonProfile/CommonProfile';
import styles from './Discovery.styles';
import DiscoveyPage from './DiscoveyPage';
import Loader from '../../components/Loader/Loader';

const Discovery = props => {
  const { navigation } = props;
  const showLoading = useSelector(state => state.discoveryPopularBands.isWaiting
    || state.treandingSongs.isWaiting);
  return (
    <URContainer>
      <Loader
        visible={ showLoading }
      />
      <View style={ styles.discoveryStyle }>
        <View style={ { height: '85%' } }>
          <CommonProfile navigation={ navigation } />
          <DiscoveyPage navigation={ navigation } />
        </View>
        <View style={ styles.miniPlayerStyle } />
      </View>
    </URContainer>
  );
};
export default Discovery;
