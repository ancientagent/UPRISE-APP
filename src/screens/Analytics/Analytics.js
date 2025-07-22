/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import {
  View, Text, ActivityIndicator, FlatList, StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-virtualized-view';
import { getSongAnalytics } from '../../state/selectors/UserProfile';
import { getSongAnalyticsSagaAction } from '../../state/actions/sagas';
import Colors from '../../theme/colors';
import { strings } from '../../utilities/localization/localization';

const Analytics = () => {
  const dispatch = useDispatch();
  const songAnalytics = useSelector(getSongAnalytics);
  const isLoading = useSelector(state => state.getSongAnalytics.isWaiting);
  const error = useSelector(state => state.getSongAnalytics.error);

  useEffect(() => {
    dispatch(getSongAnalyticsSagaAction());
  }, [dispatch]);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Song Title</Text>
      <Text style={styles.headerText}>Play Count</Text>
      <Text style={styles.headerText}>Likes</Text>
      <Text style={styles.headerText}>Upvotes</Text>
      <Text style={styles.headerText}>Skips</Text>
    </View>
  );

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cellText} numberOfLines={2}>{item.title || 'N/A'}</Text>
      <Text style={styles.cellText}>{item.songCount || 0}</Text>
      <Text style={styles.cellText}>{item.likes || 0}</Text>
      <Text style={styles.cellText}>{item.upvotes || 0}</Text>
      <Text style={styles.cellText}>{item.skips || 0}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No song analytics data available</Text>
      <Text style={styles.emptySubText}>Upload songs to see performance metrics</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.errorText}>Failed to load analytics</Text>
      <Text style={styles.errorSubText}>
        {error?.error || error?.message || 'Please try again later'}
      </Text>
      {error?.error === 'Invalid state name' && (
        <Text style={styles.errorSubText}>
          Please complete your location setup in profile settings
        </Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.container}>
        {renderErrorState()}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Song Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Track your music performance metrics</Text>
      </View>

      {songAnalytics && songAnalytics.length > 0 ? (
        <View style={styles.tableContainer}>
          {renderTableHeader()}
          <FlatList
            data={songAnalytics}
            renderItem={renderTableRow}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        renderEmptyState()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text,
  },
  tableContainer: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cellText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default Analytics; 