"use client"

import { useState, useEffect } from 'react'
import { SimpleWalletService, type SimpleWalletState } from '@/lib/simple-wallet'

export function useSimpleWallet() {
  const [state, setState] = useState<SimpleWalletState>({
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
  })

  useEffect(() => {
    const walletService = SimpleWalletService.getInstance()

    // Initialize the service
    walletService.initialize()

    // Subscribe to state changes
    const unsubscribe = walletService.subscribe(setState)

    return unsubscribe
  }, [])

  const connectWallet = async (): Promise<boolean> => {
    const walletService = SimpleWalletService.getInstance()
    return await walletService.connectWallet()
  }

  const disconnectWallet = async (): Promise<void> => {
    const walletService = SimpleWalletService.getInstance()
    await walletService.disconnectWallet()
  }

  const switchToPolygon = async (): Promise<boolean> => {
    const walletService = SimpleWalletService.getInstance()
    return await walletService.switchToPolygon()
  }

  const formatAddress = (address: string): string => {
    const walletService = SimpleWalletService.getInstance()
    return walletService.formatAddress(address)
  }

  return {
    // State
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    isReady: state.isReady,
    address: state.address,
    chainId: state.chainId,

    // Actions
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    formatAddress,

    // Helper properties for compatibility
    sessions: [],
    hasEmbeddedWallet: false,
    hasExternalWallet: state.isConnected,
    walletCount: state.isConnected ? 1 : 0,
    userEmail: null,
    userPhone: null,
    authMethod: 'wallet' as const,
  }
}