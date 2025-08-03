import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import URContainer from '../../components/URContainer/URContainer';
import Colors from '../../theme/colors';

const CommunityOnboarding = ({route}) => {
  const {genre, location} = route.params || {};

  return (
    <URContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Community!</Text>
        <Text style={styles.text}>
          You are now part of the {genre?.name || 'local'} scene in{' '}
          {location?.city || 'your city'}.
        </Text>
        <Text style={styles.text}>
          This is where the community onboarding experience will begin.
        </Text>
      </View>
    </URContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CommunityOnboarding;
