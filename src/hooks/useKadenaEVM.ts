"use client"

import { useState, useEffect, useCallback } from 'react'
import { KadenaEVMService, UserStats, KADENA_EVM_CONFIG } from '@/lib/kadena-evm'

export interface KadenaEVMState {
  isConnected: boolean
  isInitialized: boolean
  isLoading: boolean
  address: string | null
  chainId: number | null
  balance: string
  contractAddress: string | null
  contractInfo: any
}

export function useKadenaEVM() {
  const [state, setState] = useState<KadenaEVMState>({
    isConnected: false,
    isInitialized: false,
    isLoading: false,
    address: null,
    chainId: null,
    balance: '0',
    contractAddress: null,
    contractInfo: null
  })

  const kadenaEVMService = KadenaEVMService.getInstance()

  // Initialize the service
  const initialize = useCallback(async (contractAddress?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      if (contractAddress) {
        kadenaEVMService.setContractAddress(contractAddress)
        setState(prev => ({ ...prev, contractAddress }))
      }

      const success = await kadenaEVMService.initializeProvider()

      if (success && typeof window !== 'undefined' && window.ethereum) {
        // Get current account
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        if (accounts.length > 0) {
          const account = accounts[0]
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
          })

          // Convert balance from wei to ether
          const balanceInEther = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(6)

          // Get network info
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })

          setState(prev => ({
            ...prev,
            isConnected: true,
            isInitialized: true,
            address: account,
            chainId: parseInt(chainId, 16),
            balance: balanceInEther
          }))

          // Get contract info if contract address is set
          if (contractAddress) {
            const contractInfo = await kadenaEVMService.getContractInfo()
            setState(prev => ({ ...prev, contractInfo }))
          }
        } else {
          setState(prev => ({
            ...prev,
            isInitialized: true,
            isConnected: false
          }))
        }
      }
    } catch (error) {
      console.error('Failed to initialize Kadena EVM:', error)
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isConnected: false
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [kadenaEVMService])

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))

      if (!window.ethereum) {
        alert('MetaMask is required to use Kadena EVM features')
        return false
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        await initialize(state.contractAddress || undefined)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return false
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [initialize, state.contractAddress])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isInitialized: false,
      isLoading: false,
      address: null,
      chainId: null,
      balance: '0',
      contractAddress: state.contractAddress,
      contractInfo: state.contractInfo
    })
  }, [state.contractAddress, state.contractInfo])

  // Switch to Kadena network
  const switchToKadenaNetwork = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const success = await kadenaEVMService.switchToKadenaNetwork()

      if (success) {
        // Refresh state after network switch
        await initialize(state.contractAddress || undefined)
      }

      return success
    } catch (error) {
      console.error('Failed to switch network:', error)
      return false
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [kadenaEVMService, initialize, state.contractAddress])

  // Tipping functions
  const sendTip = useCallback(async (to: string, amount: string, message: string = '') => {
    try {
      if (!state.isConnected) {
        throw new Error('Wallet not connected')
      }

      setState(prev => ({ ...prev, isLoading: true }))
      return await kadenaEVMService.sendTip(to, amount, message)
    } catch (error) {
      console.error('Failed to send tip:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isConnected, kadenaEVMService])

  const sendStreamTip = useCallback(async (streamer: string, streamId: string, amount: string, message: string = '') => {
    try {
      if (!state.isConnected) {
        throw new Error('Wallet not connected')
      }

      setState(prev => ({ ...prev, isLoading: true }))
      return await kadenaEVMService.sendStreamTip(streamer, streamId, amount, message)
    } catch (error) {
      console.error('Failed to send stream tip:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isConnected, kadenaEVMService])

  const makeDonation = useCallback(async (to: string, amount: string, purpose: string, message: string = '') => {
    try {
      if (!state.isConnected) {
        throw new Error('Wallet not connected')
      }

      setState(prev => ({ ...prev, isLoading: true }))
      return await kadenaEVMService.makeDonation(to, amount, purpose, message)
    } catch (error) {
      console.error('Failed to make donation:', error)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isConnected, kadenaEVMService])

  // Data fetching functions
  const getUserStats = useCallback(async (address: string): Promise<UserStats | null> => {
    try {
      return await kadenaEVMService.getUserStats(address)
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return null
    }
  }, [kadenaEVMService])

  const getStreamTipCount = useCallback(async (streamId: string): Promise<number> => {
    try {
      return await kadenaEVMService.getStreamTipCount(streamId)
    } catch (error) {
      console.error('Failed to get stream tip count:', error)
      return 0
    }
  }, [kadenaEVMService])

  // Set contract address
  const setContractAddress = useCallback((address: string) => {
    kadenaEVMService.setContractAddress(address)
    setState(prev => ({ ...prev, contractAddress: address }))

    // If already connected, refresh contract info
    if (state.isConnected) {
      initialize(address)
    }
  }, [kadenaEVMService, state.isConnected, initialize])

  // Listen for account and network changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== state.address) {
        initialize(state.contractAddress || undefined)
      }
    }

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16)
      setState(prev => ({ ...prev, chainId: newChainId }))

      // If switched to Kadena network, refresh state
      if (newChainId === KADENA_EVM_CONFIG.chainId) {
        initialize(state.contractAddress || undefined)
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [state.address, state.contractAddress, disconnect, initialize])

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !state.isInitialized) {
      initialize()
    }
  }, [initialize, state.isInitialized])

  return {
    // State
    ...state,
    isKadenaNetwork: state.chainId === KADENA_EVM_CONFIG.chainId,

    // Actions
    connect,
    disconnect,
    switchToKadenaNetwork,
    setContractAddress,

    // Tipping functions
    sendTip,
    sendStreamTip,
    makeDonation,

    // Data functions
    getUserStats,
    getStreamTipCount,

    // Utilities
    formatAddress: kadenaEVMService.formatAddress,
    isValidAddress: kadenaEVMService.isValidAddress,

    // Config
    faucetUrl: KADENA_EVM_CONFIG.faucetUrl,
    blockExplorerUrl: KADENA_EVM_CONFIG.blockExplorerUrl
  }
}