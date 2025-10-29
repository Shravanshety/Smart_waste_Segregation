import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Avatar, List, Chip } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await DatabaseService.getLeaderboard(20);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getLevelBadge = (level) => {
    if (level >= 10) return '🌟 Master';
    if (level >= 7) return '💎 Expert';
    if (level >= 5) return '🔥 Advanced';
    if (level >= 3) return '⭐ Intermediate';
    return '🌱 Beginner';
  };

  const getConsistencyScore = (submissions) => {
    // Mock calculation - in real app, calculate based on daily consistency
    return Math.min(100, submissions * 5);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>🏆 Community Leaderboard</Title>
          <Paragraph style={styles.headerSubtitle}>
            Top eco-warriors in waste segregation
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip 
          selected={timeFilter === 'all'} 
          onPress={() => setTimeFilter('all')}
          style={styles.filterChip}
        >
          All Time
        </Chip>
        <Chip 
          selected={timeFilter === 'month'} 
          onPress={() => setTimeFilter('month')}
          style={styles.filterChip}
        >
          This Month
        </Chip>
        <Chip 
          selected={timeFilter === 'week'} 
          onPress={() => setTimeFilter('week')}
          style={styles.filterChip}
        >
          This Week
        </Chip>
      </View>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <Card style={styles.podiumCard}>
          <Card.Content>
            <Title style={styles.podiumTitle}>Top 3 Champions</Title>
            <View style={styles.podiumContainer}>
              {/* Second Place */}
              <View style={[styles.podiumItem, styles.secondPlace]}>
                <Avatar.Text 
                  size={50} 
                  label={leaderboard[1]?.username?.charAt(0).toUpperCase() || 'U'} 
                />
                <Paragraph style={styles.podiumRank}>🥈</Paragraph>
                <Paragraph style={styles.podiumName}>{leaderboard[1]?.username}</Paragraph>
                <Paragraph style={styles.podiumPoints}>{leaderboard[1]?.total_points} pts</Paragraph>
              </View>

              {/* First Place */}
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <Avatar.Text 
                  size={60} 
                  label={leaderboard[0]?.username?.charAt(0).toUpperCase() || 'U'} 
                />
                <Paragraph style={styles.podiumRank}>🥇</Paragraph>
                <Paragraph style={styles.podiumName}>{leaderboard[0]?.username}</Paragraph>
                <Paragraph style={styles.podiumPoints}>{leaderboard[0]?.total_points} pts</Paragraph>
              </View>

              {/* Third Place */}
              <View style={[styles.podiumItem, styles.thirdPlace]}>
                <Avatar.Text 
                  size={50} 
                  label={leaderboard[2]?.username?.charAt(0).toUpperCase() || 'U'} 
                />
                <Paragraph style={styles.podiumRank}>🥉</Paragraph>
                <Paragraph style={styles.podiumName}>{leaderboard[2]?.username}</Paragraph>
                <Paragraph style={styles.podiumPoints}>{leaderboard[2]?.total_points} pts</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card style={styles.leaderboardCard}>
        <Card.Content>
          <Title>Complete Rankings</Title>
          {leaderboard.map((user, index) => (
            <List.Item
              key={user.username}
              title={user.username}
              description={`${getLevelBadge(user.level)} • ${user.submissions} submissions`}
              left={() => (
                <View style={styles.rankContainer}>
                  <Paragraph style={styles.rankText}>{getRankIcon(index)}</Paragraph>
                </View>
              )}
              right={() => (
                <View style={styles.pointsContainer}>
                  <Paragraph style={styles.pointsText}>{user.total_points}</Paragraph>
                  <Paragraph style={styles.pointsLabel}>points</Paragraph>
                  <View style={styles.consistencyBar}>
                    <View 
                      style={[
                        styles.consistencyFill, 
                        { width: `${getConsistencyScore(user.submissions)}%` }
                      ]} 
                    />
                  </View>
                  <Paragraph style={styles.consistencyText}>
                    {getConsistencyScore(user.submissions)}% consistency
                  </Paragraph>
                </View>
              )}
              style={[
                styles.leaderboardItem,
                index < 3 && styles.topThreeItem
              ]}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Achievement Categories */}
      <Card style={styles.achievementCard}>
        <Card.Content>
          <Title>🎖️ Special Achievements</Title>
          <View style={styles.achievementGrid}>
            <View style={styles.achievementItem}>
              <Paragraph style={styles.achievementIcon}>🔥</Paragraph>
              <Paragraph style={styles.achievementTitle}>Streak Master</Paragraph>
              <Paragraph style={styles.achievementWinner}>
                {leaderboard[0]?.username || 'No winner yet'}
              </Paragraph>
            </View>
            <View style={styles.achievementItem}>
              <Paragraph style={styles.achievementIcon}>🎯</Paragraph>
              <Paragraph style={styles.achievementTitle}>Accuracy King</Paragraph>
              <Paragraph style={styles.achievementWinner}>
                {leaderboard[1]?.username || 'No winner yet'}
              </Paragraph>
            </View>
            <View style={styles.achievementItem}>
              <Paragraph style={styles.achievementIcon}>⚡</Paragraph>
              <Paragraph style={styles.achievementTitle}>Speed Demon</Paragraph>
              <Paragraph style={styles.achievementWinner}>
                {leaderboard[2]?.username || 'No winner yet'}
              </Paragraph>
            </View>
            <View style={styles.achievementItem}>
              <Paragraph style={styles.achievementIcon}>🌱</Paragraph>
              <Paragraph style={styles.achievementTitle}>Eco Champion</Paragraph>
              <Paragraph style={styles.achievementWinner}>
                {leaderboard[0]?.username || 'No winner yet'}
              </Paragraph>
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
  headerCard: {
    margin: 10,
    marginBottom: 5,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterChip: {
    marginHorizontal: 5,
  },
  podiumCard: {
    margin: 10,
    marginBottom: 5,
  },
  podiumTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 150,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  firstPlace: {
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 20,
  },
  thirdPlace: {
    marginBottom: 30,
  },
  podiumRank: {
    fontSize: 20,
    marginVertical: 5,
  },
  podiumName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  podiumPoints: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  leaderboardCard: {
    margin: 10,
    marginBottom: 5,
  },
  leaderboardItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topThreeItem: {
    backgroundColor: '#f8f9fa',
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  consistencyBar: {
    width: 60,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginTop: 5,
  },
  consistencyFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  consistencyText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  achievementCard: {
    margin: 10,
    marginBottom: 20,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  achievementTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementWinner: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 12,
  },
});