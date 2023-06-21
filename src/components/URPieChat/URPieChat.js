import React from 'react';
import {
  View, Text, Dimensions, StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { PieChart } from 'react-native-chart-kit';
import Colors from '../../theme/colors';

const Legend = ({
  name, color, count, isParcentage,
}) => (
  <View style={ styles.textViewContainer }>
    <View style={ [styles.indicationCircle, { backgroundColor: color }] } />
    <Text>{ '  ' }</Text>
    <View style={ { flexDirection: 'row' } }>
      <Text style={ styles.parcentageText }>
        { isParcentage ? `${count}%` : count }
      </Text>
      <Text>{ ' ' }</Text>
      <Text style={ styles.nameText }>
        { name }
      </Text>
    </View>
  </View>
);
const URPieChat = props => {
  const { title, pieChatData, isParcentage } = props;
  const screenWidth = Dimensions.get('window').width;
  return (
    <View style={ { backgroundColor: Colors.statisticsBgColor, marginBottom: 20 } }>
      <Text style={ styles.titleText }>
        { title }
      </Text>
      <View style={ { flexDirection: 'row' } }>
        <View style={ { flex: 1 } }>
          <PieChart
            data={ pieChatData }
            width={ screenWidth }
            height={ 220 }
            chartConfig={ {
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            } }
            hasLegend={ false }
            center={ [0, 0] }
            accessor='count'
            backgroundColor='transparent'
            paddingLeft='15'
            absolute
          />
        </View>
        <View style={ styles.legendView }>
          { _.map(pieChatData, ({ name, count, color }) => (
            <Legend
              key={ name }
              name={ name }
              color={ color }
              count={ count }
              isParcentage={ isParcentage }
            />
          )) }
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  URPieChatViewContainer: {
    backgroundColor: Colors.statisticsBgColor,
    marginBottom: 20,
  },
  textViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicationCircle: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.indicationCircle,
    borderStyle: 'solid',
  },
  parcentageText: {
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 12,
  },
  nameText: {
    fontFamily: 'Oswald Regular',
    color: Colors.labelColor,
    fontWeight: '400',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  titleText: {
    color: Colors.White,
    fontFamily: 'Oswald Medium',
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 25,
    marginTop: 10,
  },
  legendView: {
    flex: 1,
    marginLeft: 90,
    justifyContent: 'center',
  },
});
export default URPieChat;
