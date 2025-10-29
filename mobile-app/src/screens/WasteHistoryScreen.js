import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, List, Chip, Avatar } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function WasteHistoryScreen({ route }) {
  const { user } = route.params || {};
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    if (user) {
      try {
        const data = await DatabaseService.getWasteHistory(user.id, 50);
        setHistory(data);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  };

  const loadStats = async () => {
    if (user) {
      try {
        const data = await DatabaseService.getUserStats(user.id);
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadHistory(), loadStats()]);
    setRefreshing(false);
  };

  const getWasteIcon = (wasteType) => {
    const icons = {
      'cardboard': '📦',
      'paper': '📄',
      'plastic': '🥤',
      'metal': '🥫',
      'glass': '🍶',
      'organic': '🍎',
      'battery': '🔋',
      'electronic': '📱'
    };
    return icons[wasteType] || '🗑️';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'dry': return '#2196F3';
      case 'wet': return '#4CAF50';
      case 'hazardous': return '#f44336';
      default: return '#666';
    }
  };

  const getPointsColor = (points) => {
    return points > 0 ? '#4CAF50' : '#f44336';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getAccuracyPercentage = () => {
    if (!stats.total_submissions || stats.total_submissions === 0) return 0;
    return Math.round((stats.correct_submissions / stats.total_submissions) * 100);
  };

  const getTodaySubmissions = () => {
    const today = new Date().toDateString();
    return history.filter(item => 
      new Date(item.created_at).toDateString() === today
    ).length;
  };

  const getWeeklySubmissions = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return history.filter(item => 
      new Date(item.created_at) >= weekAgo
    ).length;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Summary Stats */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>📊 Your Waste Disposal Summary</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{getTodaySubmissions()}</Paragraph>
              <Paragraph style={styles.statLabel}>Today</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{getWeeklySubmissions()}</Paragraph>
              <Paragraph style={styles.statLabel}>This Week</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{stats.total_submissions || 0}</Paragraph>
              <Paragraph style={styles.statLabel}>Total</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statNumber}>{getAccuracyPercentage()}%</Paragraph>
              <Paragraph style={styles.statLabel}>Accuracy</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Category Breakdown */}
      <Card style={styles.categoryCard}>
        <Card.Content>
          <Title>🗂️ Waste Category Breakdown</Title>
          <View style={styles.categoryGrid}>
            <View style={styles.categoryItem}>
              <Avatar.Icon size={40} icon="recycle" style={{ backgroundColor: '#2196F3' }} />
              <Paragraph style={styles.categoryNumber}>{stats.dry_waste || 0}</Paragraph>
              <Paragraph style={styles.categoryLabel}>Dry Waste</Paragraph>
            </View>
            <View style={styles.categoryItem}>
              <Avatar.Icon size={40} icon="leaf" style={{ backgroundColor: '#4CAF50' }} />
              <Paragraph style={styles.categoryNumber}>{stats.wet_waste || 0}</Paragraph>
              <Paragraph style={styles.categoryLabel}>Wet Waste</Paragraph>
            </View>
            <View style={styles.categoryItem}>
              <Avatar.Icon size={40} icon="alert" style={{ backgroundColor: '#f44336' }} />
              <Paragraph style={styles.categoryNumber}>{stats.hazardous_waste || 0}</Paragraph>
              <Paragraph style={styles.categoryLabel}>Hazardous</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent History */}
      <Card style={styles.historyCard}>
        <Card.Content>
          <Title>📋 Recent Waste Disposals</Title>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Paragraph style={styles.emptyIcon}>🗑️</Paragraph>
              <Paragraph style={styles.emptyText}>No waste disposals yet</Paragraph>
              <Paragraph style={styles.emptySubtext}>Start logging your waste to see history here</Paragraph>
            </View>
          ) : (
            history.map((item, index) => (
              <List.Item
                key={index}
                title={`${getWasteIcon(item.waste_type)} ${item.waste_type}`}
                description={formatDate(item.created_at)}
                left={() => (
                  <View style={styles.historyLeft}>
                    <Chip 
                      style={[styles.categoryChip, { backgroundColor: getCategoryColor(item.predicted_category) }]}
                      textStyle={{ color: 'white', fontSize: 10 }}
                    >
                      {item.predicted_category}
                    </Chip>
                  </View>
                )}
                right={() => (
                  <View style={styles.historyRight}>
                    <Paragraph style={[styles.pointsEarned, { color: getPointsColor(item.points_earned) }]}>
                      {item.points_earned > 0 ? '+' : ''}{item.points_earned} pts
                    </Paragraph>
                    <Paragraph style={styles.confidence}>
                      {Math.round(item.confidence * 100)}% confidence
                    </Paragraph>
                    {item.user_category !== item.predicted_category && (
                      <Chip 
                        style={styles.mismatchChip}
                        textStyle={{ fontSize: 8 }}
                      >
                        Mismatch
                      </Chip>
                    )}
                  </View>
                )}
                style={[
                  styles.historyItem,
                  item.points_earned < 0 && styles.incorrectItem
                ]}
              />
            ))
          )}
        </Card.Content>
      </Card>

      {/* Performance Insights */}
      <Card style={styles.insightsCard}>
        <Card.Content>
          <Title>💡 Performance Insights</Title>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Paragraph style={styles.insightIcon}>🎯</Paragraph>
              <View style={styles.insightContent}>
                <Paragraph style={styles.insightTitle}>Accuracy Rate</Paragraph>
                <Paragraph style={styles.insightDescription}>
                  {getAccuracyPercentage()}% - {getAccuracyPercentage() >= 80 ? 'Excellent!' : 'Keep improving!'}
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <Paragraph style={styles.insightIcon}>📈</Paragraph>
              <View style={styles.insightContent}>
                <Paragraph style={styles.insightTitle}>Weekly Activity</Paragraph>
                <Paragraph style={styles.insightDescription}>
                  {getWeeklySubmissions()} submissions this week
                </Paragraph>
              </View>
            </View>
            
            <View style={styles.insightItem}>
              <Paragraph style={styles.insightIcon}>🏆</Paragraph>
              <View style={styles.insightContent}>
                <Paragraph style={styles.insightTitle}>Best Category</Paragraph>
                <Paragraph style={styles.insightDescription}>
                  {stats.dry_waste >= stats.wet_waste ? 'Dry waste' : 'Wet waste'} - Most submissions
                </Paragraph>
              </View>
            </View>
          </View>
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
  summaryCard: {
    margin: 10,
    marginBottom: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  categoryCard: {
    margin: 10,
    marginBottom: 5,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historyCard: {
    margin: 10,
    marginBottom: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#666',
    textAlign: 'center',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  incorrectItem: {
    backgroundColor: '#ffebee',
  },
  historyLeft: {
    justifyContent: 'center',
  },
  categoryChip: {
    marginRight: 10,
  },
  historyRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pointsEarned: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  confidence: {
    fontSize: 12,
    color: '#666',
  },
  mismatchChip: {
    backgroundColor: '#ff9800',
    marginTop: 2,
  },
  insightsCard: {
    margin: 10,
    marginBottom: 20,
  },
  insightsList: {
    marginTop: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  insightDescription: {
    color: '#666',
    fontSize: 12,
  },
});