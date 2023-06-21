import React from 'react';
import { H3 } from 'native-base';
import {
  View, Modal, ActivityIndicator,
} from 'react-native';
import styles from './Loader.style';
import Colors from '../../theme/colors';

const Loader = ({ visible = false, loadingText }) => visible && (
  <Modal visible transparent statusBarTranslucent>
    <View
      style={ styles.container }
    >
      <ActivityIndicator size='large' color={ Colors.White } />
      <H3 style={ styles.loadingText }>{ loadingText }</H3>
    </View>
  </Modal>
);

export default Loader;
