import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, List, Button, Chip } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function AdminPanel({ route }) {
  const { user } = route.params || {};
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const requests = await DatabaseService.getPendingCollectorRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const approveRequest = async (request) => {
    try {
      await DatabaseService.approveCollectorRequest(request.id, request.user_id);
      Alert.alert('Success', `${request.username} approved as collector`);
      loadPendingRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve request');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🛡️ Admin Panel</Title>
          
          <Title style={styles.sectionTitle}>Pending Collector Requests</Title>
          {pendingRequests.length === 0 ? (
            <List.Item title="No pending requests" />
          ) : (
            pendingRequests.map((request) => (
              <List.Item
                key={request.id}
                title={request.username}
                description={request.email}
                right={() => (
                  <View style={styles.requestActions}>
                    <Chip style={styles.pendingChip}>Pending</Chip>
                    <Button
                      mode="contained"
                      onPress={() => approveRequest(request)}
                      style={styles.approveButton}
                    >
                      Approve
                    </Button>
                  </View>
                )}
                style={styles.requestItem}
              />
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  requestItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingChip: {
    backgroundColor: '#FF9800',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
});