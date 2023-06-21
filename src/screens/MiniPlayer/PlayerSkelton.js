import React from 'react';
import { View, Image } from 'react-native';
import styles from './MiniPlayer.styles';

const defaultPlayerImg = require('../../../assets/images/music_default_img.png');

const PlayerSkelton = () => (
  <View
    style={ [styles.miniPlayerView] }
  >
    <View>
      <Image
        style={ styles.songImage }
        source={ defaultPlayerImg }
      />
    </View>
    <View style={ [styles.songDetailsTextView, { justifyContent: 'center' }] }>
      <View style={ styles.PlayerSkeltonContainer }>
        <View style={ styles.skeltonBox1 } />
        <View style={ styles.skeltonBox2 } />
      </View>
      <View style={ styles.skeltonBox3 } />
    </View>
  </View>
);

export default PlayerSkelton;
