"use client"

import { usePrivy, useWallets, useSendTransaction } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { polygon } from 'viem/chains'

export interface PrivyWalletState {
  isConnected: boolean
  isLoading: boolean
  isReady: boolean
  address: string | null
  chainId: number | null
  user: any | null
}

export function usePrivyWallet() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    createWallet,
    connectWallet,
    sendTransaction
  } = usePrivy()

  const { wallets } = useWallets()
  const { sendTransaction: sendTx } = useSendTransaction()

  const [state, setState] = useState<PrivyWalletState>({
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
    user: null,
  })

  // Update state when Privy state changes
  useEffect(() => {
    const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
    const connectedWallet = wallets.find(wallet => wallet.connectionStatus === 'connected')
    const activeWallet = embeddedWallet || connectedWallet

    setState({
      isConnected: authenticated && !!activeWallet,
      isLoading: !ready,
      isReady: ready,
      address: activeWallet?.address || null,
      chainId: polygon.id, // Default to Polygon
      user: user,
    })
  }, [ready, authenticated, user, wallets])

  // Connect wallet function
  const connectWalletHandler = async () => {
    try {
      if (!authenticated) {
        // Login first
        await login()
        return
      }

      // If user is authenticated but has no wallet, create one
      const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
      if (!embeddedWallet) {
        await createWallet()
      } else {
        // If they have an embedded wallet, try to connect an external one
        await connectWallet()
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      throw error
    }
  }

  // Send tip function using Privy
  const sendTip = async (toAddress: string, amount: string): Promise<string | null> => {
    try {
      if (!state.isConnected) {
        throw new Error('Wallet not connected')
      }

      const amountInWei = BigInt(parseFloat(amount) * 1e18)

      const txHash = await sendTx({
        to: toAddress as `0x${string}`,
        value: amountInWei,
        chainId: polygon.id,
      })

      return txHash?.transactionHash || null
    } catch (error) {
      console.error('Failed to send tip:', error)
      return null
    }
  }

  // Format address for display
  const formatAddress = (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Switch to Polygon network
  const switchToPolygon = async (): Promise<boolean> => {
    try {
      // Privy handles network switching automatically
      // This would be handled by the wallet provider
      return true
    } catch (error) {
      console.error('Failed to switch to Polygon:', error)
      return false
    }
  }

  return {
    // State
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    isReady: state.isReady,
    address: state.address,
    chainId: state.chainId,
    user: state.user,

    // Actions
    connectWallet: connectWalletHandler,
    disconnectWallet,
    sendTip,
    switchToPolygon,
    formatAddress,

    // Privy specific
    login,
    logout,
    createWallet,
    connectExternalWallet: connectWallet,

    // User info
    userEmail: user?.email?.address,
    userPhone: user?.phone?.number,
    authMethod: user?.linkedAccounts?.[0]?.type,
    hasEmbeddedWallet: !!wallets.find(wallet => wallet.walletClientType === 'privy'),
    hasExternalWallet: !!wallets.find(wallet => wallet.walletClientType !== 'privy'),
    walletCount: wallets.length,
  }
}