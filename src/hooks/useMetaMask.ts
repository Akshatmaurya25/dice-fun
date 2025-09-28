"use client"

import { useState, useEffect } from 'react'
import { MetaMaskAdapter, type MetaMaskState } from '@/lib/metamask-adapter'

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    isLoading: true,
    isReady: false,
    address: null,
    chainId: null,
  })

  useEffect(() => {
    const adapter = MetaMaskAdapter.getInstance()

    // Initialize adapter
    adapter.initialize()

    // Subscribe to state changes
    const unsubscribe = adapter.subscribe(setState)

    return unsubscribe
  }, [])

  const connectWallet = async (): Promise<boolean> => {
    const adapter = MetaMaskAdapter.getInstance()
    return await adapter.connectWallet()
  }

  const disconnectWallet = async (): Promise<void> => {
    const adapter = MetaMaskAdapter.getInstance()
    await adapter.disconnectWallet()
  }

  const switchToKadena = async (): Promise<boolean> => {
    const adapter = MetaMaskAdapter.getInstance()
    return await adapter.switchToKadena()
  }

  const formatAddress = (address: string): string => {
    const adapter = MetaMaskAdapter.getInstance()
    return adapter.formatAddress(address)
  }

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    switchToKadena,
    formatAddress,
  }
}