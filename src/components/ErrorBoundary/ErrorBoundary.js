import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, error: null, errorInfo: null};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== ERROR BOUNDARY CAUGHT ERROR ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1a1a1a',
            padding: 20,
          }}>
          <Text style={{color: 'red', fontSize: 18, marginBottom: 10}}>
            Something went wrong with this component.
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
            }}>
            This might be causing missing text or buttons.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
            onPress={() =>
              this.setState({hasError: false, error: null, errorInfo: null})
            }>
            <Text style={{color: 'white', fontSize: 16}}>Try Again</Text>
          </TouchableOpacity>
          <Text style={{color: 'grey', fontSize: 12, marginTop: 20}}>
            Error: {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
