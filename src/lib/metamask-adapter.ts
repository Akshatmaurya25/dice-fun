"use client"

import { ethers } from "ethers"
import { EthereumProvider, WalletError, ChainParams } from '@/lib/types'

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export interface MetaMaskState {
  isConnected: boolean
  isLoading: boolean
  isReady: boolean
  address: string | null
  chainId: number | null
}

export class MetaMaskAdapter {
  private static instance: MetaMaskAdapter
  private state: MetaMaskState = {
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
  }
  private listeners: ((state: MetaMaskState) => void)[] = []
  private provider: EthereumProvider | null = null
  private ethersProvider: ethers.BrowserProvider | null = null

  static getInstance(): MetaMaskAdapter {
    if (!MetaMaskAdapter.instance) {
      MetaMaskAdapter.instance = new MetaMaskAdapter()
    }
    return MetaMaskAdapter.instance
  }

  async initialize(): Promise<void> {
    console.log('🦊 MetaMask: Initializing adapter...')

    this.state.isLoading = true
    this.state.isReady = false
    this.notifyListeners()

    try {
      await new Promise(resolve => setTimeout(resolve, 100))

      this.provider = this.getMetaMaskProvider()

      if (this.provider) {
        console.log('✅ MetaMask: Provider found')
        this.ethersProvider = new ethers.BrowserProvider(this.provider)

        // Check existing connection
        try {
          const accounts = await Promise.race([
            this.provider.request({ method: 'eth_accounts' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
          ]) as string[]

          if (accounts && accounts.length > 0) {
            this.state.address = accounts[0]
            this.state.isConnected = true

            const chainId = await this.provider.request({ method: 'eth_chainId' })
            this.state.chainId = parseInt(chainId as string, 16)

            console.log('✅ MetaMask: Found existing connection', this.state.address)
          }
        } catch (error) {
          console.log('ℹ️ MetaMask: No existing connection')
        }

        // Setup event listeners
        this.provider.on('accountsChanged', this.handleAccountsChanged.bind(this))
        this.provider.on('chainChanged', this.handleChainChanged.bind(this))
      } else {
        console.log('❌ MetaMask: Not available')
      }

    } catch (error) {
      console.error('❌ MetaMask: Initialization error:', error)
    } finally {
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()
      console.log('✅ MetaMask: Initialization complete')
    }
  }

  private getMetaMaskProvider(): any {
    if (typeof window === 'undefined') return null

    // Method 1: Direct MetaMask detection via providers array
    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      const metamask = window.ethereum.providers.find((provider: EthereumProvider) => {
        return provider.isMetaMask && !provider.isPhantom && !provider.isCoinbaseWallet
      })
      if (metamask) {
        console.log('🦊 MetaMask: Found via providers array')
        return metamask
      }
    }

    // Method 2: Check if window.ethereum is MetaMask directly
    if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom) {
      console.log('🦊 MetaMask: Found as primary provider')
      return window.ethereum
    }

    // Method 3: Force MetaMask request (this bypasses other wallets)
    if (window.ethereum) {
      // Try to specifically request MetaMask
      try {
        if (window.ethereum.providers) {
          const metamask = window.ethereum.providers.find((p: EthereumProvider) => p.isMetaMask)
          if (metamask) {
            console.log('🦊 MetaMask: Forced selection from providers')
            return metamask
          }
        }
      } catch (e) {
        console.log('🔍 MetaMask: Provider detection failed, trying fallback')
      }
    }

    return null
  }

  async connectWallet(): Promise<boolean> {
    console.log('🔗 MetaMask: Connecting...')

    if (!this.provider) {
      this.provider = this.getMetaMaskProvider()
      if (!this.provider) {
        console.log('❌ MetaMask: Not available')
        return false
      }
      this.ethersProvider = new ethers.BrowserProvider(this.provider)
      this.provider.on('accountsChanged', this.handleAccountsChanged.bind(this))
      this.provider.on('chainChanged', this.handleChainChanged.bind(this))
    }

    try {
      this.state.isLoading = true
      this.notifyListeners()

      // Force MetaMask connection request
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      }) as string[]

      if (accounts && accounts.length > 0) {
        this.state.address = accounts[0]
        this.state.isConnected = true

        const chainId = await this.provider.request({ method: 'eth_chainId' })
        this.state.chainId = parseInt(chainId as string, 16)

        console.log('✅ MetaMask: Connected successfully', this.state.address)

        // Switch to Kadena if needed
        if (this.state.chainId !== 5920) {
          console.log('🔄 MetaMask: Switching to Kadena Testnet...')
          await this.switchToKadena()
        }

        return true
      }

      return false
    } catch (error: unknown) {
      const walletError = error as WalletError;
      console.error('❌ MetaMask: Connection failed:', walletError)
      return false
    } finally {
      this.state.isLoading = false
      this.notifyListeners()
    }
  }

  async disconnectWallet(): Promise<void> {
    console.log('🔌 MetaMask: Disconnecting...')

    this.state.address = null
    this.state.isConnected = false
    this.state.chainId = null

    this.notifyListeners()
    console.log('✅ MetaMask: Disconnected')
  }

  async switchToKadena(): Promise<boolean> {
    if (!this.provider) return false

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1720' }], // Kadena Chainweb EVM Testnet (5920)
      })
      return true
    } catch (switchError: unknown) {
      const walletError = switchError as WalletError;
      if (walletError.code === 4902) {
        try {
          await this.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1720',
                chainName: 'Kadena Chainweb EVM Testnet 20',
                nativeCurrency: {
                  name: 'KDA',
                  symbol: 'KDA',
                  decimals: 18,
                },
                rpcUrls: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
                blockExplorerUrls: ['http://chain-20.evm-testnet-blockscout.chainweb.com'],
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Failed to add Kadena network:', addError)
          return false
        }
      }
      console.error('Failed to switch to Kadena:', switchError)
      return false
    }
  }

  private handleAccountsChanged(accounts: string[]): void {
    console.log('👤 MetaMask: Accounts changed', accounts)
    if (accounts.length > 0) {
      this.state.address = accounts[0]
      this.state.isConnected = true
    } else {
      this.state.address = null
      this.state.isConnected = false
    }
    this.notifyListeners()
  }

  private handleChainChanged(chainId: string): void {
    console.log('🔗 MetaMask: Chain changed', chainId)
    this.state.chainId = parseInt(chainId, 16)
    this.notifyListeners()
  }

  subscribe(listener: (state: MetaMaskState) => void): () => void {
    this.listeners.push(listener)
    listener(this.state)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }))
  }

  getState(): MetaMaskState {
    return { ...this.state }
  }

  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
}