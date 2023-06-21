import React, { Component } from 'react';
import { connectStyle, mapPropsToStyleNames } from 'native-base';
import { View } from 'react-native';

class SvgImage extends Component {
  render() {
    const {
      iconName, width, height, iconStyle,
    } = this.props;
    const SvgIcon = iconName;
    if (SvgIcon) {
      return (
        <View style={ iconStyle }>
          <SvgIcon
            width={ width }
            height={ height }
          />
        </View>
      );
    }
    return null;
  }
}

export const ConnectedSvgImage = connectStyle(
  'SvgImage',
  {},
  mapPropsToStyleNames,
)(SvgImage);

export default ConnectedSvgImage;
