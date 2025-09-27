"use client"

import { useState, useEffect } from 'react'
import { WalletConnectWalletService, WalletConnectWalletState } from '@/lib/walletconnect-wallet'

export function useWalletConnect() {
  const [state, setState] = useState<WalletConnectWalletState>({
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
    sessions: [],
  })

  useEffect(() => {
    const walletService = WalletConnectWalletService.getInstance()

    // Initialize the service
    walletService.initialize()

    // Subscribe to state changes
    const unsubscribe = walletService.subscribe(setState)

    return unsubscribe
  }, [])

  const connectWallet = async (): Promise<boolean> => {
    const walletService = WalletConnectWalletService.getInstance()
    return await walletService.connectWallet()
  }

  const disconnectWallet = async (): Promise<void> => {
    const walletService = WalletConnectWalletService.getInstance()
    await walletService.disconnectWallet()
  }

  const sendTip = async (toAddress: string, amount: string, streamId?: string, message?: string): Promise<string | null> => {
    const walletService = WalletConnectWalletService.getInstance()
    return await walletService.sendTip(toAddress, amount, streamId, message)
  }

  const switchToPolygon = async (): Promise<boolean> => {
    const walletService = WalletConnectWalletService.getInstance()
    return await walletService.switchToPolygon()
  }

  const pairWithDapp = async (uri: string): Promise<boolean> => {
    const walletService = WalletConnectWalletService.getInstance()
    return await walletService.pairWithDapp(uri)
  }

  const formatAddress = (address: string): string => {
    const walletService = WalletConnectWalletService.getInstance()
    return walletService.formatAddress(address)
  }

  return {
    // State
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    isReady: state.isReady,
    address: state.address,
    chainId: state.chainId,
    sessions: state.sessions,

    // Actions
    connectWallet,
    disconnectWallet,
    sendTip,
    switchToPolygon,
    pairWithDapp,
    formatAddress,

    // Helper properties
    hasEmbeddedWallet: false, // WalletConnect doesn't have embedded wallets
    hasExternalWallet: state.isConnected,
    walletCount: state.isConnected ? 1 : 0,
    userEmail: null, // WalletConnect doesn't provide email
    userPhone: null, // WalletConnect doesn't provide phone
    authMethod: 'wallet', // Always wallet-based authentication
  }
}