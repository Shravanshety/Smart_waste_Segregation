import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CameraScreen from './src/screens/CameraScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import WasteHistoryScreen from './src/screens/WasteHistoryScreen';
import AdminPanel from './src/screens/AdminPanel';
import CollectorDashboard from './src/screens/CollectorDashboard';

const Stack = createStackNavigator();

export default function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Rewards" component={RewardsScreen} />
          <Stack.Screen name="WasteHistory" component={WasteHistoryScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="CollectorDashboard" component={CollectorDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}