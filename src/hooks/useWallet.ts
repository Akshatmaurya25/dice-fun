"use client"

import { useState, useEffect } from 'react'
import { WalletService, WalletState } from '@/lib/wallet'

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    provider: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const walletService = WalletService.getInstance()
    const unsubscribe = walletService.subscribe(setWalletState)

    return unsubscribe
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      const walletService = WalletService.getInstance()
      const success = await walletService.connectMetaMask()

      if (success && walletService.getState().chainId !== 137) {
        // Try to switch to Polygon if not already on it
        await walletService.switchToPolygon()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    const walletService = WalletService.getInstance()
    walletService.disconnect()
  }

  const sendTip = async (toAddress: string, amount: string) => {
    const walletService = WalletService.getInstance()
    return await walletService.sendTip(toAddress, amount)
  }

  const formatAddress = (address: string) => {
    const walletService = WalletService.getInstance()
    return walletService.formatAddress(address)
  }

  const switchToPolygon = async () => {
    const walletService = WalletService.getInstance()
    return await walletService.switchToPolygon()
  }

  return {
    ...walletState,
    isConnecting,
    connectWallet,
    disconnectWallet,
    sendTip,
    formatAddress,
    switchToPolygon,
    isPolygon: walletState.chainId === 137,
  }
}