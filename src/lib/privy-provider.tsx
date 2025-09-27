'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { polygon } from 'viem/chains';

export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clzk6u8xz05gyl2pz2xjckafz"}
      config={{
        // Appearance customization
        appearance: {
          theme: 'light',
          accentColor: '#22C55E', // Kadena green
          logo: 'https://kadelive.com/logo.png',
          showWalletLoginFirst: false,
        },

        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },

        // Configure supported networks
        supportedChains: [polygon],

        // Default chain
        defaultChain: polygon,

        // Login methods configuration
        loginMethods: [
          'email',
          'wallet',
          'google',
          'twitter',
          'discord',
          'apple',
        ],

        // Enable additional features
        mfa: {
          noPromptOnMfaRequired: false,
        },

        // Funding methods
        fundingMethods: ['coinbase_pay'],

        // Cross-app wallets for better UX
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: 'smartWalletOnly',
          },
          metamask: {},
          walletConnect: {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c7bbcb0e4153fb9581712573298cdc67',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}