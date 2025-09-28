// Common TypeScript interfaces for wallet and contract types

// Ethereum provider interface
export interface EthereumProvider {
  isMetaMask?: boolean;
  isPhantom?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  providers?: EthereumProvider[];
}

// Window interface with Ethereum provider
declare global {
  interface Window {
    ethereum?: EthereumProvider;
    MetaMask?: EthereumProvider;
  }
}

// User statistics interface
export interface UserStats {
  tipCount: bigint;
  totalTipsSent: bigint;
  totalTipsReceived: bigint;
  donationCount: bigint;
  totalDonationsSent: bigint;
}

// Error interface
export interface WalletError {
  code?: number;
  message: string;
  stack?: string;
}

// WalletConnect session interfaces
export interface SessionStruct {
  topic: string;
  pairingTopic: string;
  relay: { protocol: string; data: string };
  expiry: number;
  namespaces: Record<string, any>;
  requiredNamespaces: Record<string, any>;
  optionalNamespaces: Record<string, any>;
  sessionProperties: Record<string, any>;
  peer: { metadata: any };
  controller: string;
  self: { publicKey: string; metadata: any };
  acknowledged: boolean;
}

export interface SessionRequest {
  topic: string;
  params: {
    request: {
      method: string;
      params?: unknown[];
    };
    chainId: string;
    expiry: number;
    requester: any;
  };
  id: number;
}

export interface SessionProposal {
  id: number;
  params: {
    requiredNamespaces: Record<string, any>;
    optionalNamespaces: Record<string, any>;
    relays: { protocol: string; data?: string }[];
    proposer: {
      publicKey: string;
      metadata: any;
    };
  };
}

// Transaction interface
export interface TransactionRequest {
  to: string;
  value?: string | number;
  data?: string;
  gasLimit?: string | number;
  gasPrice?: string | number;
  nonce?: number;
}

// Chain switching parameters
export interface ChainParams {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}

// Network parameters
export interface NetworkParams {
  chainId: string;
}