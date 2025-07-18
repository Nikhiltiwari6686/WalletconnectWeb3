// ConnectWallet.tsx
import React from "react";
import { Button, View, Text } from "react-native";
import { useWalletConnectModal } from "@walletconnect/modal-react-native";

export default function ConnectWallet() {
  const { open, close, provider, isConnected, address } = useWalletConnectModal();

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={isConnected ? `Disconnect ${address}` : "Connect Wallet"}
        onPress={() => (isConnected ? close() : open())}
      />
      {isConnected && (
        <Text style={{ marginTop: 10 }}>Connected: {address}</Text>
      )}
    </View>
  );
}
