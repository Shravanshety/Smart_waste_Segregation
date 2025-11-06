import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, List, Button, Chip, TextInput, Paragraph } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function AdminPanel({ route }) {
  const { user } = route.params || {};
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rewardSettings, setRewardSettings] = useState({
    correctPoints: 10,
    incorrectPoints: -5,
    accuracyThreshold: 0.8
  });

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

  const updateRewardSettings = () => {
    Alert.alert('Settings Updated', 'Reward settings have been updated successfully.');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🛡️ Admin Panel</Title>
          
          <Title style={styles.sectionTitle}>Collector Requests</Title>
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

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Reward Settings</Title>
          <Paragraph style={styles.subtitle}>Manage point system and rewards</Paragraph>
          
          <TextInput
            label="Points for Correct Classification"
            value={rewardSettings.correctPoints.toString()}
            onChangeText={(text) => setRewardSettings({...rewardSettings, correctPoints: parseInt(text) || 10})}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Points for Incorrect Classification"
            value={rewardSettings.incorrectPoints.toString()}
            onChangeText={(text) => setRewardSettings({...rewardSettings, incorrectPoints: parseInt(text) || -5})}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Accuracy Threshold (0.0 - 1.0)"
            value={rewardSettings.accuracyThreshold.toString()}
            onChangeText={(text) => setRewardSettings({...rewardSettings, accuracyThreshold: parseFloat(text) || 0.8})}
            keyboardType="decimal-pad"
            style={styles.input}
            mode="outlined"
          />
          
          <Button 
            mode="contained" 
            onPress={updateRewardSettings}
            style={styles.updateButton}
          >
            Update Settings
          </Button>
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
  subtitle: {
    color: '#666',
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
});