import React from 'react';
import {
  View, Text, Dimensions, StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '../../theme/colors';

const URLineChart = props => {
  const { title, lineChartData, lineStrokeColor } = props;
  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: Colors.statisticsBgColor,
    backgroundGradientTo: Colors.statisticsBgColor,
    decimalPlaces: 0,
    color: () => lineStrokeColor,
    labelColor: /* istanbul ignore next */(opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForLabels: styles.propsForLabels,
    propsForBackgroundLines: {
      r: '6',
      strokeWidth: '1',
      stroke: Colors.lineChartBackgroundLinesStrokeColor,
    },
    strokeWidth: 2, // optional, default 3
    barPercentage: 5,
  };
  return (
    <View style={ { backgroundColor: Colors.statisticsBgColor, marginBottom: 20 } }>
      <Text style={ styles.titleText }>
        { title }
      </Text>
      <View style={ { marginBottom: 20 } }>
        <LineChart
          data={ lineChartData }
          width={ screenWidth - 20 }
          height={ 220 }
          chartConfig={ chartConfig }
          style={ styles.lineChartStyle }
          segments={ 5 }
        />
        <View style={ { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' } }>
          <Text style={ styles.indicationText }>X- Time period</Text>
          <Text style={ styles.indicationText }>Y- Count</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  indicationText: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 14,
    color: Colors.White,
  },
  propsForLabels: {
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    fontSize: 10,
  },
  lineChartStyle: {
    paddingRight: 50,
    marginTop: 10,
  },
  titleText: {
    color: Colors.White,
    fontFamily: 'Oswald Medium',
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 25,
    marginTop: 10,
  },
});
export default URLineChart;
