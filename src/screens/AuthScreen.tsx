import React, { useState } from 'react';
import {
  View,
  Button,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

import {
  initWalletConnect,
  getWalletAddress,
} from '../utils/walletConnect';

type AuthNav = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthNav>();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await initWalletConnect();

      // Poll up to 15 seconds for the wallet address
      let attempts = 0;
      let address: string | null = null;

      while (attempts < 15) {
        address = getWalletAddress();
        if (address) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        console.log(`Attempt ${attempts}: Waiting for wallet address...`);
      }

      setWalletAddress(address);

      if (address) {
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Connection Failed', 'No wallet address received. Please try again.');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert('Error', 'Something went wrong during wallet connection.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect your wallet</Text>
      {connecting ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Connect Wallet" onPress={handleConnect} />
      )}
      {walletAddress && (
        <Text style={styles.address}>Connected: {walletAddress}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  address: {
    marginTop: 20,
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
  },
});
