import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, Title, Paragraph, RadioButton, ActivityIndicator } from 'react-native-paper';
import WasteClassificationService from '../services/WasteClassificationService';
import DatabaseService from '../services/DatabaseService';

export default function CameraScreen({ navigation, route }) {
  const { user } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const [capturedImage, setCapturedImage] = useState(null);
  const [userCategory, setUserCategory] = useState('dry');
  const [isProcessing, setIsProcessing] = useState(false);
  const [classification, setClassification] = useState(null);
  const [qrCodeScanned, setQrCodeScanned] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (route.params?.qrCode) {
      setQrCodeScanned(route.params.qrCode);
    }
  }, [route.params]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        await processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      await processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri) => {
    setIsProcessing(true);
    try {
      const result = await WasteClassificationService.classifyWaste(imageUri);
      setClassification(result);
      
      // Show detection result to user
      if (result.detectedObject) {
        Alert.alert(
          'Waste Detected!',
          `AI detected: ${result.detectedObject}\nCategory: ${result.category}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
    setIsProcessing(false);
  };

  const submitWaste = async () => {
    if (!classification || !user) {
      Alert.alert('Error', 'Missing classification or user data');
      return;
    }

    if (!qrCodeScanned) {
      Alert.alert('QR Code Required', 'Please scan a QR code first', [
        { text: 'Scan QR Code', onPress: () => navigation.navigate('QRScanner') }
      ]);
      return;
    }

    const pointsEarned = WasteClassificationService.calculatePoints(classification, userCategory);
    
    const submissionData = {
      userId: user.id,
      wasteType: classification.class,
      predictedCategory: classification.category,
      userCategory: userCategory,
      confidence: classification.confidence,
      pointsEarned: pointsEarned,
      imageUri: capturedImage,
      qrCodeScanned: qrCodeScanned
    };

    try {
      await DatabaseService.submitWaste(submissionData);
      
      const message = pointsEarned > 0 
        ? `Great job! You earned ${pointsEarned} points for correct segregation.`
        : `Incorrect segregation. You lost ${Math.abs(pointsEarned)} points. The waste is ${classification.category}, not ${userCategory}.`;
      
      Alert.alert(
        pointsEarned > 0 ? 'Success!' : 'Incorrect Classification',
        message,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit waste data');
    }
  };

  const simulateCapture = () => {
    // Mock image for testing
    const mockImage = 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Waste+Sample';
    setCapturedImage(mockImage);
    processImage(mockImage);
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
            <Paragraph>Please grant camera permission to log waste.</Paragraph>
            <Button mode="contained" onPress={simulateCapture} style={styles.button}>
              Use Demo Image
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Waste Classification</Title>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Paragraph>🔍 YOLOv8n analyzing waste...</Paragraph>
                <Paragraph style={styles.processingSubtext}>Detecting objects and categorizing waste</Paragraph>
              </View>
            ) : classification ? (
              <View>
                <Paragraph style={styles.aiResult}>
                  🤖 YOLOv8n Detected: {classification.detectedObject || classification.class}
                </Paragraph>
                <Paragraph style={styles.categoryResult}>
                  📂 Category: {classification.category.toUpperCase()}
                </Paragraph>
                <Paragraph style={styles.confidence}>
                  Confidence: {(classification.confidence * 100).toFixed(1)}%
                </Paragraph>
                
                <Title style={styles.sectionTitle}>Select Your Category:</Title>
                <RadioButton.Group onValueChange={setUserCategory} value={userCategory}>
                  <View style={styles.radioItem}>
                    <RadioButton value="dry" />
                    <Paragraph>Dry Waste (Paper, Plastic, Metal)</Paragraph>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="wet" />
                    <Paragraph>Wet Waste (Food, Organic)</Paragraph>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="hazardous" />
                    <Paragraph>Hazardous Waste (Batteries, Chemicals)</Paragraph>
                  </View>
                </RadioButton.Group>

                {qrCodeScanned && (
                  <Paragraph style={styles.qrStatus}>
                    ✅ QR Code: {qrCodeScanned}
                  </Paragraph>
                )}
                
                <View style={styles.buttonContainer}>
                  <Button mode="outlined" onPress={() => setCapturedImage(null)}>
                    Retake
                  </Button>
                  <Button mode="contained" onPress={submitWaste}>
                    Submit & Earn Points
                  </Button>
                </View>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      
      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <Button mode="contained" onPress={() => navigation.navigate('QRScanner')}>
            {qrCodeScanned ? '✅ QR Scanned' : 'Scan QR First'}
          </Button>
        </View>
        
        <View style={styles.bottomControls}>
          <Button 
            mode="contained" 
            onPress={takePicture} 
            style={styles.captureButton}
          >
            📸 Capture & Detect
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
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  topControls: {
    padding: 20,
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  captureButton: {
    backgroundColor: '#4CAF50',
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
  card: {
    margin: 10,
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  aiResult: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 5,
  },
  categoryResult: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'center',
    marginVertical: 5,
  },
  confidence: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  qrStatus: {
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});