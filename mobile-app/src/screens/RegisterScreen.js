import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    householdSize: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await DatabaseService.registerUser(formData);
      if (result.success) {
        Alert.alert(
          'Registration Successful!', 
          `Your unique QR code: ${result.qrCode}\nSave this for waste logging.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Username or email may already exist.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Create Account</Title>
          <Paragraph style={styles.subtitle}>
            Register to get your unique household QR code
          </Paragraph>
          
          <TextInput
            label="Username *"
            value={formData.username}
            onChangeText={(text) => setFormData({...formData, username: text})}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Household Size"
            value={formData.householdSize}
            onChangeText={(text) => setFormData({...formData, householdSize: text})}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            multiline
            style={styles.input}
            mode="outlined"
          />
          
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            Register & Get QR Code
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Already have an account? Login
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
    margin: 20,
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