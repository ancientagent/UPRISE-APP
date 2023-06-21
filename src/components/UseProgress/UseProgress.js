import React from 'react';
import { View, Text } from 'react-native';
import {
  useProgress,
} from 'react-native-track-player';
import Slider from 'react-native-slider';
import Colors from '../../theme/colors';

const UseProgress = props => {
  const {
    sliderStyle, trackStyle, thumbStyle, timeTextView, timeText, onSlidingComplete, disabled, sliderView,
    setHideSkip, hideSkip, onDemand,
  } = props;
  const progress = useProgress();
  const songPosition = 32;
  if ((Math.round(progress.position) >= songPosition && !hideSkip && !onDemand)) {
    setHideSkip(true);
  } else if ((Math.round(progress.position) < songPosition && hideSkip && !onDemand)) {
    setHideSkip(false);
  }
  return (
    <View style={ sliderView }>
      <View>
        <Slider
          style={ sliderStyle }
          value={ progress.position }
          maximumValue={ progress.duration }
          minimumValue={ 0 }
          trackStyle={ trackStyle }
          thumbStyle={ thumbStyle }
          disabled={ disabled }
          thumbTintColor={ Colors.URbtnColor }
          minimumTrackTintColor={ Colors.URbtnColor }
          maximumTrackTintColor={ Colors.labelBgColor }
          onSlidingComplete={ onSlidingComplete }
        />
      </View>
      <View style={ timeTextView }>
        <Text style={ timeText }>
          { new Date(progress.position * 1000).toISOString().substr(14, 5) }
        </Text>
        <Text style={ timeText }>
          { new Date((progress.duration - progress.position) * 1000)
            .toISOString()
            .substr(14, 5) }
        </Text>
      </View>
    </View>
  );
};
export default UseProgress;
