import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Config from 'react-native-config';
import { searchCities } from '../../services/googlePlaces/googlePlaces.service';

const TestPlaces = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testPlacesAPI = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter some text to search');
      return;
    }

    setLoading(true);
    try {
      console.log('=== TESTING GOOGLE PLACES API ===');
      console.log('Input:', input);
      console.log('API Key available:', !!Config.GOOGLE_PLACES_API_KEY);
      console.log('MAP_API_KEY available:', !!Config.MAP_API_KEY);
      
      const suggestions = await searchCities(input);
      console.log('API Response:', suggestions);
      
      setResults(suggestions || []);
      
      if (suggestions && suggestions.length > 0) {
        Alert.alert('Success', `Found ${suggestions.length} suggestions!`);
      } else {
        Alert.alert('No Results', 'No suggestions found for this input.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', `API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Places API Test</Text>
      
      <Text style={styles.info}>
        API Key: {Config.GOOGLE_PLACES_API_KEY ? '✅ Available' : '❌ Missing'}
      </Text>
      <Text style={styles.info}>
        MAP_API_KEY: {Config.MAP_API_KEY ? '✅ Available' : '❌ Missing'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter city name (e.g., Austin)"
        value={input}
        onChangeText={setInput}
        placeholderTextColor="#888"
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={testPlacesAPI}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test API'}
        </Text>
      </TouchableOpacity>
      
      {results.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Results:</Text>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultItem}>
              {result.displayText} (ID: {result.placeId})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    backgroundColor: '#333333',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
});

export default TestPlaces; 