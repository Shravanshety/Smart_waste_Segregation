import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

export default function QRScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Validate QR code format
    if (data.startsWith('WASTE_BIN_') || data.startsWith('TRUCK_') || data.startsWith('USER_')) {
      Alert.alert(
        'QR Code Scanned Successfully!',
        `Scanned: ${data}`,
        [
          {
            text: 'Take Photo',
            onPress: () => navigation.navigate('Camera', { qrCode: data })
          },
          {
            text: 'Scan Again',
            onPress: () => setScanned(false)
          }
        ]
      );
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This QR code is not valid for waste logging.',
        [{ text: 'Try Again', onPress: () => setScanned(false) }]
      );
    }
  };

  const simulateQRScan = () => {
    const mockQRCodes = ['WASTE_BIN_001', 'TRUCK_ABC123', 'USER_DEMO_001'];
    const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    handleBarCodeScanned({ type: 'qr', data: randomQR });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Requesting Camera Permission</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>No Camera Access</Title>
            <Paragraph>Please grant camera permission to scan QR codes.</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.scanner}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <Card style={styles.instructionCard}>
            <Card.Content>
              <Title style={styles.instructionTitle}>Scan QR Code</Title>
              <Paragraph style={styles.instructionText}>
                Point your camera at the QR code on:
              </Paragraph>
              <Paragraph>• Smart waste bins</Paragraph>
              <Paragraph>• Collection trucks</Paragraph>
              <Paragraph>• Your household bin</Paragraph>
            </Card.Content>
          </Card>
        </View>
        
        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
        </View>
        
        <View style={styles.bottomSection}>
          {scanned && (
            <Button
              mode="contained"
              onPress={() => setScanned(false)}
              style={styles.rescanButton}
            >
              Tap to Scan Again
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={simulateQRScan}
            style={styles.mockButton}
          >
            Demo QR Scan
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Back to Dashboard
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topSection: {
    padding: 20,
  },
  instructionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  instructionTitle: {
    textAlign: 'center',
    color: '#333',
  },
  instructionText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  bottomSection: {
    padding: 20,
    alignItems: 'center',
  },
  rescanButton: {
    marginBottom: 10,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  mockButton: {
    marginBottom: 10,
    backgroundColor: '#FF9800',
  },
  card: {
    margin: 20,
  },
});