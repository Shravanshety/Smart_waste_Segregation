import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, List, Chip, ProgressBar } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function RewardsScreen({ route }) {
  const { user } = route.params || {};
  const [userPoints, setUserPoints] = useState(0);
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  const rewards = [
    {
      id: 1,
      title: '₹50 Shopping Voucher',
      description: 'Redeem at partner stores',
      points: 100,
      category: 'voucher',
      icon: '🛒',
      available: true
    },
    {
      id: 2,
      title: 'Free Coffee',
      description: 'At local coffee shops',
      points: 50,
      category: 'food',
      icon: '☕',
      available: true
    },
    {
      id: 3,
      title: 'Movie Ticket',
      description: 'Single movie ticket',
      points: 200,
      category: 'entertainment',
      icon: '🎬',
      available: true
    },
    {
      id: 4,
      title: 'Eco-friendly Bag',
      description: 'Reusable shopping bag',
      points: 75,
      category: 'eco',
      icon: '👜',
      available: true
    },
    {
      id: 5,
      title: 'Plant Sapling',
      description: 'Native plant for your garden',
      points: 30,
      category: 'eco',
      icon: '🌱',
      available: true
    },
    {
      id: 6,
      title: '₹100 Grocery Voucher',
      description: 'Use at supermarkets',
      points: 180,
      category: 'voucher',
      icon: '🥬',
      available: true
    },
    {
      id: 7,
      title: 'Bike Rental (1 day)',
      description: 'Eco-friendly transport',
      points: 120,
      category: 'transport',
      icon: '🚲',
      available: true
    },
    {
      id: 8,
      title: 'Organic Fertilizer',
      description: '1kg organic compost',
      points: 40,
      category: 'eco',
      icon: '🌿',
      available: true
    }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (user) {
      try {
        const stats = await DatabaseService.getUserStats(user.id);
        setUserPoints(stats?.total_points || 0);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  };

  const redeemReward = async (reward) => {
    if (userPoints < reward.points) {
      Alert.alert('Insufficient Points', `You need ${reward.points - userPoints} more points to redeem this reward.`);
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Redeem ${reward.title} for ${reward.points} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            try {
              // In a real app, this would call an API to process the redemption
              const newPoints = userPoints - reward.points;
              setUserPoints(newPoints);
              setRedeemedRewards([...redeemedRewards, { ...reward, redeemedAt: new Date() }]);
              
              Alert.alert(
                'Reward Redeemed!',
                `${reward.title} has been added to your account. Check your email for the voucher code.`
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to redeem reward. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getProgressToNextReward = () => {
    const affordableRewards = rewards.filter(r => r.points <= userPoints);
    const nextReward = rewards
      .filter(r => r.points > userPoints)
      .sort((a, b) => a.points - b.points)[0];
    
    if (!nextReward) return { progress: 1, nextReward: null };
    
    const progress = userPoints / nextReward.points;
    return { progress, nextReward };
  };

  const { progress, nextReward } = getProgressToNextReward();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'voucher': return '#4CAF50';
      case 'food': return '#FF9800';
      case 'entertainment': return '#9C27B0';
      case 'eco': return '#2E7D32';
      case 'transport': return '#2196F3';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Points Summary */}
      <Card style={styles.pointsCard}>
        <Card.Content>
          <Title style={styles.pointsTitle}>Your Reward Points</Title>
          <View style={styles.pointsContainer}>
            <Paragraph style={styles.pointsNumber}>{userPoints}</Paragraph>
            <Paragraph style={styles.pointsLabel}>Available Points</Paragraph>
          </View>
          
          {nextReward && (
            <View style={styles.progressContainer}>
              <Paragraph style={styles.progressText}>
                Progress to {nextReward.title}: {userPoints}/{nextReward.points}
              </Paragraph>
              <ProgressBar progress={progress} color="#4CAF50" style={styles.progressBar} />
              <Paragraph style={styles.progressRemaining}>
                {nextReward.points - userPoints} points to go!
              </Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Available Rewards */}
      <Card style={styles.rewardsCard}>
        <Card.Content>
          <Title>🎁 Available Rewards</Title>
          {rewards.map((reward) => (
            <List.Item
              key={reward.id}
              title={reward.title}
              description={reward.description}
              left={() => (
                <View style={styles.rewardIcon}>
                  <Paragraph style={styles.iconText}>{reward.icon}</Paragraph>
                </View>
              )}
              right={() => (
                <View style={styles.rewardRight}>
                  <Chip 
                    style={[styles.categoryChip, { backgroundColor: getCategoryColor(reward.category) }]}
                    textStyle={{ color: 'white', fontSize: 10 }}
                  >
                    {reward.category}
                  </Chip>
                  <Paragraph style={styles.pointsCost}>{reward.points} pts</Paragraph>
                  <Button
                    mode={userPoints >= reward.points ? 'contained' : 'outlined'}
                    onPress={() => redeemReward(reward)}
                    disabled={userPoints < reward.points}
                    style={styles.redeemButton}
                    compact
                  >
                    {userPoints >= reward.points ? 'Redeem' : 'Need More'}
                  </Button>
                </View>
              )}
              style={[
                styles.rewardItem,
                userPoints >= reward.points && styles.affordableReward
              ]}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Redeemed Rewards History */}
      {redeemedRewards.length > 0 && (
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title>📋 Redemption History</Title>
            {redeemedRewards.map((reward, index) => (
              <List.Item
                key={index}
                title={reward.title}
                description={`Redeemed on ${reward.redeemedAt.toLocaleDateString()}`}
                left={() => (
                  <View style={styles.rewardIcon}>
                    <Paragraph style={styles.iconText}>{reward.icon}</Paragraph>
                  </View>
                )}
                right={() => (
                  <Paragraph style={styles.redeemedPoints}>-{reward.points} pts</Paragraph>
                )}
                style={styles.historyItem}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Earning Tips */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title>💡 How to Earn More Points</Title>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Paragraph style={styles.tipIcon}>📸</Paragraph>
              <View style={styles.tipContent}>
                <Paragraph style={styles.tipTitle}>Correct Classification</Paragraph>
                <Paragraph style={styles.tipDescription}>+10-15 points per correct waste segregation</Paragraph>
              </View>
            </View>
            
            <View style={styles.tipItem}>
              <Paragraph style={styles.tipIcon}>🔥</Paragraph>
              <View style={styles.tipContent}>
                <Paragraph style={styles.tipTitle}>Daily Streak</Paragraph>
                <Paragraph style={styles.tipDescription}>+5 bonus points for consecutive days</Paragraph>
              </View>
            </View>
            
            <View style={styles.tipItem}>
              <Paragraph style={styles.tipIcon}>🎯</Paragraph>
              <View style={styles.tipContent}>
                <Paragraph style={styles.tipTitle}>High Accuracy</Paragraph>
                <Paragraph style={styles.tipDescription}>+3 bonus points for 90%+ accuracy</Paragraph>
              </View>
            </View>
            
            <View style={styles.tipItem}>
              <Paragraph style={styles.tipIcon}>👥</Paragraph>
              <View style={styles.tipContent}>
                <Paragraph style={styles.tipTitle}>Community Challenges</Paragraph>
                <Paragraph style={styles.tipDescription}>Participate in weekly challenges for bonus points</Paragraph>
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
  pointsCard: {
    margin: 10,
    marginBottom: 5,
  },
  pointsTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pointsLabel: {
    color: '#666',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressRemaining: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
    fontSize: 12,
  },
  rewardsCard: {
    margin: 10,
    marginBottom: 5,
  },
  rewardItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  affordableReward: {
    backgroundColor: '#f8fff8',
  },
  rewardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  iconText: {
    fontSize: 24,
  },
  rewardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  categoryChip: {
    marginBottom: 5,
  },
  pointsCost: {
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  redeemButton: {
    minWidth: 80,
  },
  historyCard: {
    margin: 10,
    marginBottom: 5,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  redeemedPoints: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  tipsCard: {
    margin: 10,
    marginBottom: 20,
  },
  tipsList: {
    marginTop: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tipDescription: {
    color: '#666',
    fontSize: 12,
  },
});