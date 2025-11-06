import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, ProgressBar, IconButton } from 'react-native-paper';
// QR Code component removed due to dependency conflicts
// import QRCode from 'react-native-qrcode-svg';
import DatabaseService from '../services/DatabaseService';

export default function DashboardScreen({ navigation, route }) {
  const { user } = route.params;
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const userStats = await DatabaseService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserStats();
    setRefreshing(false);
  };

  const getLevelProgress = () => {
    if (!stats) return 0;
    const pointsForNextLevel = (stats.level * 100);
    const currentLevelPoints = stats.total_points % 100;
    return currentLevelPoints / 100;
  };

  const getConsistencyStreak = () => {
    // Mock calculation - in real app, calculate based on daily submissions
    return Math.floor(Math.random() * 15) + 1;
  };

  const requestCollectorRole = async () => {
    try {
      await DatabaseService.requestCollectorRole(user.id);
      Alert.alert('Request Sent', 'Your collector role request has been sent to admin for approval.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send request. You may have already requested.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Smart Waste App</Title>
        <IconButton 
          icon="logout" 
          size={24} 
          onPress={handleLogout}
          iconColor="#f44336"
        />
      </View>
      
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* User Profile Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text size={60} label={user.username.charAt(0).toUpperCase()} />
            <View style={styles.profileInfo}>
              <Title>{user.username}</Title>
              <Paragraph>Level {stats?.level || 1} Eco Warrior</Paragraph>
              <Paragraph>{getConsistencyStreak()} day streak 🔥</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Points & Level Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>🎁 Your Points & Level</Title>
            <View style={styles.pointsContainer}>
              <View style={styles.pointsBox}>
                <Title style={styles.pointsNumber}>{stats?.total_points || 0}</Title>
                <Paragraph>Total Points</Paragraph>
              </View>
              <View style={styles.pointsBox}>
                <Title style={styles.pointsNumber}>{stats?.level || 1}</Title>
                <Paragraph>Current Level</Paragraph>
              </View>
            </View>
            <Paragraph>Progress to Level {(stats?.level || 1) + 1}</Paragraph>
            <ProgressBar progress={getLevelProgress()} color="#4CAF50" style={styles.progressBar} />
          </Card.Content>
        </Card>

        {/* QR Code Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.qrContent}>
            <Title>📱 Your Household QR Code</Title>
            <View style={styles.qrContainer}>
              <Paragraph style={styles.qrPlaceholder}>📱 QR Code: {user.qr_code}</Paragraph>
            </View>
            <Paragraph style={styles.qrText}>
              Scan this code at waste bins or show to collectors
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Today's Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>📊 Waste Statistics</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats?.total_submissions || 0}</Title>
                <Paragraph>Total Submissions</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats?.correct_submissions || 0}</Title>
                <Paragraph>Correct Classifications</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats?.dry_waste || 0}</Title>
                <Paragraph>Dry Waste</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>{stats?.wet_waste || 0}</Title>
                <Paragraph>Wet Waste</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Actions</Title>
            {user.role === 'ADMIN' ? (
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('AdminPanel', { user })}
                style={styles.adminButton}
                icon="shield"
              >
                Admin Panel
              </Button>
            ) : user.role === 'COLLECTOR' ? (
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('CollectorDashboard', { user })}
                style={styles.collectorButton}
                icon="truck"
              >
                Collector Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Camera')}
                  style={styles.actionButton}
                  icon="camera"
                >
                  Log Waste
                </Button>
                <Button 
                  mode="text" 
                  onPress={requestCollectorRole}
                  style={styles.collectorRequest}
                >
                  Request Collector Role
                </Button>
              </>
            )}
            <View style={styles.actionButtons}>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Leaderboard')}
                style={styles.actionButton}
                icon="trophy"
              >
                Leaderboard
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => navigation.navigate('Rewards', { user })}
                style={styles.actionButton}
                icon="gift"
              >
                Rewards
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    marginBottom: 5,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  pointsBox: {
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 32,
    color: '#4CAF50',
  },
  progressBar: {
    marginTop: 10,
    height: 8,
  },
  qrContent: {
    alignItems: 'center',
  },
  qrContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  qrPlaceholder: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrText: {
    textAlign: 'center',
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    color: '#2196F3',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 0.48,
  },
  adminButton: {
    backgroundColor: '#f44336',
    marginBottom: 10,
  },
  collectorButton: {
    backgroundColor: '#FF9800',
    marginBottom: 10,
  },
  collectorRequest: {
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

});