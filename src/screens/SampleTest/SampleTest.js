import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from './SampleTest.styles';
// TODO this is for testing purpose we added code here. this will no longer be here
import viewProfileImage from '../../../assets/images/viewprofile.svg';
import SvgImage from '../../components/SvgImage/SvgImage';
import Colors from '../../theme/colors';

export default function SampleTest(props) {
  const { navigation } = props;
  return (
    <View style={ styles.container }>
      <Text>Welcome to Uprise</Text>

      { /* TODO this is for testing purpose we added code here. this will no longer be here */ }
      <SvgImage iconName={ viewProfileImage } height={ 30 } width={ 30 } />
      <Button
        title='Start'
        loading={ false }
        loadingProps={ { size: 'small', color: Colors.Black } }
        buttonStyle={ {
          backgroundColor: 'rgba(111, 202, 186, 1)',
          borderRadius: 5,
        } }
        titleStyle={ { fontWeight: 'bold' } }
        containerStyle={ {
          width: 100,
          marginVertical: 50,
        } }
        onPress={ () => navigation.navigate('Signup') }
      />
    </View>
  );
}
