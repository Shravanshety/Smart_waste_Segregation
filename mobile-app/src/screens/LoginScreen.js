import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await DatabaseService.loginUser(username, password);
      if (result.success) {
        navigation.replace('Dashboard', { user: result.user });
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const showDebugInfo = async () => {
    try {
      const users = await DatabaseService.getAllUsers();
      Alert.alert('Debug Info', `Total users: ${users.length}\nUsers: ${users.map(u => u.username).join(', ')}`);
    } catch (error) {
      Alert.alert('Debug Error', error.message);
    }
  };

  const resetStorage = async () => {
    try {
      await DatabaseService.clearStorage();
      Alert.alert('Success', 'Storage cleared and reset with default users');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset storage');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>🌱 Smart Waste App</Title>
          <Paragraph style={styles.subtitle}>
            Login to track your waste segregation and earn rewards
          </Paragraph>
          
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Login
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Don't have an account? Register
          </Button>
          
          <Button
            mode="text"
            onPress={showDebugInfo}
            style={styles.linkButton}
          >
            Debug: Show Users
          </Button>
          
          <Button
            mode="text"
            onPress={resetStorage}
            style={styles.linkButton}
          >
            Reset Storage
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  linkButton: {
    marginTop: 10,
  },
});