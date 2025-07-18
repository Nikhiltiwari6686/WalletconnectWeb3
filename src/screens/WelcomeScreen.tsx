import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { disconnectWallet, getWalletAddress } from '../utils/walletConnect';

type WelcomeNav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNav>();
  const address = getWalletAddress();

  const handleDisconnect = async () => {
    await disconnectWallet();
    navigation.replace('Auth'); // Go back to Auth screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Welcome!</Text>
      <Text style={styles.label}>Your Wallet Address:</Text>
      <Text style={styles.address}>{address || 'No address found'}</Text>
      <Button title="Disconnect Wallet" onPress={handleDisconnect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
});
