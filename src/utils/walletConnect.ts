import { UniversalProvider } from '@walletconnect/universal-provider';
import '@walletconnect/react-native-compat';
import { Platform, Linking } from 'react-native';

const projectId = '928b9b61e1bea9d2511c76172cacb8ac'; // Replace with your own WalletConnect Project ID


const providerMetadata = {
  name: 'YourApp',
  description: 'WalletConnect Demo',
  url: 'https://yourapp.com',
  icons: ['https://yourapp.com/logo.png'],
  redirect: {
    native: 'walletconnect://', // Matches your scheme in AndroidManifest.xml
    universal: 'https://yourapp.com', // Optional fallback
  },
};

let provider: Awaited<ReturnType<typeof UniversalProvider.init>> | null = null;

export const initWalletConnect = async () => {
  provider = await UniversalProvider.init({
    projectId,
    metadata: providerMetadata,
  });

  // 🔔 Listen for QR code or wallet URI
  provider.on('display_uri', async (uri: string) => {
    const wcUri = `wc:${uri}`;
    console.log('WalletConnect URI:', wcUri);

    const canOpen = await Linking.canOpenURL(wcUri);
    if (canOpen) {
      await Linking.openURL(wcUri);
    } else {
      console.warn('Wallet app not installed or cannot handle WalletConnect URI');

      // Fallback to MetaMask deep link
      const fallback = `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
      try {
        await Linking.openURL(fallback);
      } catch (err) {
        console.error('MetaMask fallback failed:', err);
      }
    }
  });

  // 👇 Required to emit display_uri
  await provider.connect({
    namespaces: {
      eip155: {
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
        chains: ['eip155:1'],
        events: ['chainChanged', 'accountsChanged'],
        rpcMap: {
          '1': 'https://sepolia.infura.io/v3/01f9e5db3a684ed98995d6b596b83134',
        },
      },
    },
  });

  return provider;
};

export const getWalletAddress = (): string | null => {
  if (!provider) return null;
  return provider.session?.namespaces?.eip155?.accounts?.[0] ?? null;
};

export const isWalletConnected = (): boolean => {
  return !!(provider && provider.session);
};

export const disconnectWallet = async () => {
  if (provider) {
    await provider.disconnect();
    provider = null;
  }
};
