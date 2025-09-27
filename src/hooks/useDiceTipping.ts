import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, KADENA_EVM_NETWORKS } from '@/config/contracts';
import DiceTippingABI from '@/contracts/DiceTipping.json';

export interface UserStats {
  totalTipsSent: bigint;
  totalTipsReceived: bigint;
  totalDonationsSent: bigint;
  totalDonationsReceived: bigint;
  tipCount: bigint;
  donationCount: bigint;
}

export interface TipData {
  from: string;
  to: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
  isStreamTip: boolean;
  streamId: string;
}

export interface DonationData {
  from: string;
  to: string;
  amount: bigint;
  purpose: string;
  message: string;
  timestamp: bigint;
}

export function useDiceTipping() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider and contract
  useEffect(() => {
    initializeProvider();
  }, []);

  const initializeProvider = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        // Check if already connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          setSigner(signer);
          setAccount(await signer.getAddress());
          setIsConnected(true);

          // Initialize contract with signer for write operations
          const contract = new ethers.Contract(
            CONTRACT_ADDRESSES.DiceTipping.testnet,
            DiceTippingABI.abi,
            signer
          );
          setContract(contract);
        } else {
          // Initialize contract with provider for read-only operations
          const contract = new ethers.Contract(
            CONTRACT_ADDRESSES.DiceTipping.testnet,
            DiceTippingABI.abi,
            provider
          );
          setContract(contract);
        }
      }
    } catch (err) {
      console.error('Failed to initialize provider:', err);
      setError('Failed to initialize web3 provider');
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask is required to use this feature');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setIsConnected(true);

      // Update contract with signer
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.DiceTipping.testnet,
        DiceTippingABI.abi,
        signer
      );
      setContract(contract);

      // Switch to Kadena EVM network if needed
      await switchToKadenaNetwork();

    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToKadenaNetwork = async () => {
    try {
      const kadenaNetwork = KADENA_EVM_NETWORKS.testnet;

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${kadenaNetwork.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          const kadenaNetwork = KADENA_EVM_NETWORKS.testnet;
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${kadenaNetwork.chainId.toString(16)}`,
                chainName: kadenaNetwork.name,
                rpcUrls: [kadenaNetwork.rpcUrl],
                nativeCurrency: kadenaNetwork.nativeCurrency,
                blockExplorerUrls: [kadenaNetwork.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Kadena network:', addError);
          throw new Error('Failed to add Kadena EVM network to wallet');
        }
      } else {
        console.error('Failed to switch to Kadena network:', switchError);
        throw new Error('Failed to switch to Kadena EVM network');
      }
    }
  };

  const sendTip = async (to: string, message: string, amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!contract || !signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      const tipAmount = ethers.parseEther(amount);

      const tx = await contract.sendTip(to, message, {
        value: tipAmount,
        gasLimit: 300000,
      });

      await tx.wait();
      return tx;
    } catch (err: any) {
      console.error('Failed to send tip:', err);
      setError(err.message || 'Failed to send tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendStreamTip = async (streamer: string, streamId: string, message: string, amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!contract || !signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      const tipAmount = ethers.parseEther(amount);

      const tx = await contract.sendStreamTip(streamer, streamId, message, {
        value: tipAmount,
        gasLimit: 300000,
      });

      await tx.wait();
      return tx;
    } catch (err: any) {
      console.error('Failed to send stream tip:', err);
      setError(err.message || 'Failed to send stream tip');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const makeDonation = async (to: string, purpose: string, message: string, amount: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!contract || !signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      const donationAmount = ethers.parseEther(amount);

      const tx = await contract.makeDonation(to, purpose, message, {
        value: donationAmount,
        gasLimit: 300000,
      });

      await tx.wait();
      return tx;
    } catch (err: any) {
      console.error('Failed to make donation:', err);
      setError(err.message || 'Failed to make donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserStats = async (address: string): Promise<UserStats | null> => {
    try {
      if (!contract) return null;

      const stats = await contract.getUserStats(address);
      return {
        totalTipsSent: stats.totalTipsSent,
        totalTipsReceived: stats.totalTipsReceived,
        totalDonationsSent: stats.totalDonationsSent,
        totalDonationsReceived: stats.totalDonationsReceived,
        tipCount: stats.tipCount,
        donationCount: stats.donationCount,
      };
    } catch (err) {
      console.error('Failed to get user stats:', err);
      return null;
    }
  };

  const getRecentTips = async (limit: number = 10) => {
    try {
      if (!contract) return [];

      const tipIds = await contract.getRecentTips(limit);
      const tips = [];

      for (const tipId of tipIds) {
        const tip = await contract.tips(tipId);
        tips.push({
          id: tipId,
          from: tip.from,
          to: tip.to,
          amount: tip.amount,
          message: tip.message,
          timestamp: tip.timestamp,
          isStreamTip: tip.isStreamTip,
          streamId: tip.streamId,
        });
      }

      return tips;
    } catch (err) {
      console.error('Failed to get recent tips:', err);
      return [];
    }
  };

  const getStreamTips = async (streamId: string) => {
    try {
      if (!contract) return [];

      const tipIds = await contract.getStreamTips(streamId);
      const tips = [];

      for (const tipId of tipIds) {
        const tip = await contract.tips(tipId);
        tips.push({
          id: tipId,
          from: tip.from,
          to: tip.to,
          amount: tip.amount,
          message: tip.message,
          timestamp: tip.timestamp,
          isStreamTip: tip.isStreamTip,
          streamId: tip.streamId,
        });
      }

      return tips;
    } catch (err) {
      console.error('Failed to get stream tips:', err);
      return [];
    }
  };

  const getContractInfo = async () => {
    try {
      if (!contract) return null;

      const [platformFee, minTip, minDonation, totalTips, totalDonations] = await Promise.all([
        contract.platformFeePercentage(),
        contract.minimumTipAmount(),
        contract.minimumDonationAmount(),
        contract.getTotalTips(),
        contract.getTotalDonations(),
      ]);

      return {
        platformFeePercentage: Number(platformFee),
        minimumTipAmount: ethers.formatEther(minTip),
        minimumDonationAmount: ethers.formatEther(minDonation),
        totalTips: Number(totalTips),
        totalDonations: Number(totalDonations),
      };
    } catch (err) {
      console.error('Failed to get contract info:', err);
      return null;
    }
  };

  return {
    // State
    contract,
    provider,
    signer,
    account,
    isConnected,
    isLoading,
    error,

    // Actions
    connectWallet,
    sendTip,
    sendStreamTip,
    makeDonation,
    getUserStats,
    getRecentTips,
    getStreamTips,
    getContractInfo,
    switchToKadenaNetwork,
  };
}