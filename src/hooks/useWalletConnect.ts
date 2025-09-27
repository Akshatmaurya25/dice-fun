"use client"

import { useState, useEffect } from "react"
import { WalletConnectService, WalletConnectState } from "@/lib/walletconnect"
import { usePrivyWallet } from "@/hooks/usePrivyWallet"

export function useWalletConnect() {
  const { isConnected, address, user } = usePrivyWallet()
  const [walletConnectState, setWalletConnectState] = useState<WalletConnectState>({
    isInitialized: false,
    activeSessions: [],
    pendingRequests: [],
    pairings: [],
  })
  const [isInitializing, setIsInitializing] = useState(false)

  // Initialize WalletConnect when user is connected
  useEffect(() => {
    if (isConnected && address && !walletConnectState.isInitialized && !isInitializing) {
      initializeWalletConnect()
    }
  }, [isConnected, address, walletConnectState.isInitialized, isInitializing])

  // Subscribe to WalletConnect state changes
  useEffect(() => {
    const service = WalletConnectService.getInstance()
    const unsubscribe = service.subscribe(setWalletConnectState)
    return unsubscribe
  }, [])

  const initializeWalletConnect = async () => {
    if (!address) return

    setIsInitializing(true)
    try {
      const service = WalletConnectService.getInstance()

      // Create a sign message function using Privy
      const signMessage = async (message: string): Promise<string> => {
        // This would use Privy's signing functionality
        // For now, return a mock signature
        console.log("Signing message:", message)
        return "0x" + "00".repeat(65) // Mock signature
      }

      await service.initialize(address, signMessage)
    } catch (error) {
      console.error("Failed to initialize WalletConnect:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  const pairWithDApp = async (uri: string) => {
    try {
      const service = WalletConnectService.getInstance()
      await service.pair(uri)
    } catch (error) {
      console.error("Failed to pair with dApp:", error)
      throw error
    }
  }

  const disconnectSession = async (topic: string) => {
    try {
      const service = WalletConnectService.getInstance()
      await service.disconnectSession(topic)
    } catch (error) {
      console.error("Failed to disconnect session:", error)
      throw error
    }
  }

  const disconnectAllSessions = async () => {
    try {
      const service = WalletConnectService.getInstance()
      const sessions = service.getActiveSessions()

      await Promise.all(
        Object.keys(sessions).map(topic => service.disconnectSession(topic))
      )
    } catch (error) {
      console.error("Failed to disconnect all sessions:", error)
      throw error
    }
  }

  return {
    // State
    isInitialized: walletConnectState.isInitialized,
    isInitializing,
    activeSessions: walletConnectState.activeSessions,
    pendingRequests: walletConnectState.pendingRequests,
    pairings: walletConnectState.pairings,
    sessionCount: walletConnectState.activeSessions.length,

    // Actions
    pairWithDApp,
    disconnectSession,
    disconnectAllSessions,
    initializeWalletConnect,

    // Computed
    hasActiveSessions: walletConnectState.activeSessions.length > 0,
    isReady: isConnected && walletConnectState.isInitialized,
  }
}