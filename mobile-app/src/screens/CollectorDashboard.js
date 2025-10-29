import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Button, TextInput, Paragraph } from 'react-native-paper';
import DatabaseService from '../services/DatabaseService';

export default function CollectorDashboard({ route, navigation }) {
  const { user } = route.params || {};
  const [qrCode, setQrCode] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [userCategory, setUserCategory] = useState('');
  const [predictedCategory, setPredictedCategory] = useState('');

  const scanQR = () => {
    navigation.navigate('QRScanner', { 
      onScan: (scannedCode) => setQrCode(scannedCode),
      collectorMode: true 
    });
  };

  const verifyWaste = async () => {
    if (!qrCode || !wasteType || !userCategory || !predictedCategory) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const submissionData = {
        userId: 1, // Extract from QR code in real implementation
        collectorId: user.id,
        wasteType,
        predictedCategory,
        userCategory,
        confidence: 0.9,
        qrCodeScanned: qrCode
      };

      const result = await DatabaseService.submitWaste(submissionData);
      
      Alert.alert(
        'Verification Complete',
        `Accuracy: ${(result.accuracy * 100).toFixed(0)}%\nPoints: ${result.points > 0 ? '+' : ''}${result.points}`,
        [{ text: 'OK', onPress: () => clearForm() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to verify waste');
    }
  };

  const clearForm = () => {
    setQrCode('');
    setWasteType('');
    setUserCategory('');
    setPredictedCategory('');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🚛 Collector Dashboard</Title>
          <Paragraph style={styles.subtitle}>Verify waste segregation accuracy</Paragraph>

          <Button mode="outlined" onPress={scanQR} style={styles.button}>
            📱 Scan User QR Code
          </Button>
          
          {qrCode && (
            <Paragraph style={styles.qrResult}>Scanned: {qrCode}</Paragraph>
          )}

          <TextInput
            label="Waste Type"
            value={wasteType}
            onChangeText={setWasteType}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="AI Predicted Category"
            value={predictedCategory}
            onChangeText={setPredictedCategory}
            style={styles.input}
            mode="outlined"
            placeholder="dry/wet/hazardous"
          />

          <TextInput
            label="User Selected Category"
            value={userCategory}
            onChangeText={setUserCategory}
            style={styles.input}
            mode="outlined"
            placeholder="dry/wet/hazardous"
          />

          <Button 
            mode="contained" 
            onPress={verifyWaste} 
            style={styles.verifyButton}
          >
            ✅ Verify & Score
          </Button>

          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoTitle}>Scoring System</Title>
              <Paragraph>• Correct classification: +10 points</Paragraph>
              <Paragraph>• Incorrect classification: -5 points</Paragraph>
              <Paragraph>• Benchmark accuracy: 80%</Paragraph>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    flex: 1,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    marginBottom: 15,
  },
  qrResult: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  verifyButton: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#4CAF50',
  },
  infoCard: {
    marginTop: 20,
    backgroundColor: '#e8f5e8',
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
});