"use client"

import { ethers } from "ethers"

export interface SimpleWalletState {
  isConnected: boolean
  isLoading: boolean
  isReady: boolean
  address: string | null
  chainId: number | null
}

export class SimpleWalletService {
  private static instance: SimpleWalletService
  private state: SimpleWalletState = {
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
  }
  private listeners: ((state: SimpleWalletState) => void)[] = []
  private ethereum: any = null
  private provider: ethers.BrowserProvider | null = null

  static getInstance(): SimpleWalletService {
    if (!SimpleWalletService.instance) {
      SimpleWalletService.instance = new SimpleWalletService()
    }
    return SimpleWalletService.instance
  }

  async initialize(): Promise<void> {
    console.log('🔄 SimpleWallet: Starting initialization...')

    // Always start fresh
    this.state.isLoading = true
    this.state.isReady = false
    this.notifyListeners()

    try {
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100))

      // Detect and prioritize MetaMask
      const preferredWallet = this.detectMetaMask()

      if (preferredWallet) {
        console.log('✅ SimpleWallet: MetaMask provider found')
        this.ethereum = preferredWallet
        this.provider = new ethers.BrowserProvider(this.ethereum)

        // Check existing connection (with timeout)
        try {
          const accounts = await Promise.race([
            this.ethereum.request({ method: 'eth_accounts' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
          ]) as string[]

          if (accounts && accounts.length > 0) {
            this.state.address = accounts[0]
            this.state.isConnected = true

            const chainId = await this.ethereum.request({ method: 'eth_chainId' })
            this.state.chainId = parseInt(chainId as string, 16)

            console.log('✅ SimpleWallet: Found existing MetaMask connection', this.state.address)
          }
        } catch (error) {
          console.log('ℹ️ SimpleWallet: No existing MetaMask connection found')
        }

        // Setup event listeners
        this.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this))
        this.ethereum.on('chainChanged', this.handleChainChanged.bind(this))
      } else {
        console.log('ℹ️ SimpleWallet: MetaMask not found')
      }

    } catch (error) {
      console.error('❌ SimpleWallet: Initialization error:', error)
    } finally {
      // Always mark as ready
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()
      console.log('✅ SimpleWallet: Initialization complete')
    }
  }

  private detectMetaMask(): any {
    if (typeof window === 'undefined') {
      console.log('🌐 SimpleWallet: Window not available (SSR)')
      return null
    }

    // Direct MetaMask access via window.ethereum.providers (most reliable)
    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      console.log('🔍 SimpleWallet: Scanning providers for MetaMask...')

      // Find MetaMask specifically in providers array
      const metamask = window.ethereum.providers.find((provider: any) =>
        provider.isMetaMask && !provider.isPhantom
      )

      if (metamask) {
        console.log('✅ SimpleWallet: MetaMask found in providers array')
        return metamask
      }
    }

    // Check if MetaMask is the primary provider
    if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom) {
      console.log('✅ SimpleWallet: MetaMask detected as primary provider')
      return window.ethereum
    }

    // Direct access to MetaMask if available
    if ((window as any).ethereum?.isMetaMask) {
      console.log('✅ SimpleWallet: MetaMask found via direct access')
      return (window as any).ethereum
    }

    // Try to access MetaMask via global window property
    if ((window as any).MetaMask) {
      console.log('✅ SimpleWallet: MetaMask found via global property')
      return (window as any).MetaMask
    }

    console.log('❌ SimpleWallet: MetaMask not detected')
    return null
  }

  async connectWallet(): Promise<boolean> {
    console.log('🔗 SimpleWallet: Connecting to MetaMask...')

    // Get MetaMask provider
    if (!this.ethereum) {
      const metamaskProvider = this.detectMetaMask()
      if (metamaskProvider) {
        this.ethereum = metamaskProvider
        this.provider = new ethers.BrowserProvider(this.ethereum)
        // Setup event listeners
        this.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this))
        this.ethereum.on('chainChanged', this.handleChainChanged.bind(this))
      } else {
        console.log('❌ SimpleWallet: MetaMask not found')
        return false
      }
    }

    // Ensure we have MetaMask
    if (!this.ethereum?.isMetaMask) {
      console.log('❌ SimpleWallet: Provider is not MetaMask')
      return false
    }

    try {
      this.state.isLoading = true
      this.notifyListeners()

      console.log('🦊 SimpleWallet: Requesting MetaMask account access...')
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[]

      if (accounts && accounts.length > 0) {
        this.state.address = accounts[0]
        this.state.isConnected = true

        const chainId = await this.ethereum.request({ method: 'eth_chainId' })
        this.state.chainId = parseInt(chainId as string, 16)

        console.log('✅ SimpleWallet: Connected to MetaMask successfully', this.state.address)

        // Switch to Polygon if needed
        if (this.state.chainId !== 137) {
          console.log('🔄 SimpleWallet: Switching to Polygon network...')
          await this.switchToPolygon()
        }

        return true
      }

      return false
    } catch (error: any) {
      console.error('❌ SimpleWallet: Connection failed:', error)

      if (error.code === 4001) {
        alert('MetaMask connection was rejected. Please approve the connection to continue.')
      } else if (error.message?.includes('User rejected')) {
        alert('Connection rejected. Please approve the connection in MetaMask.')
      } else {
        alert(`Failed to connect to MetaMask: ${error.message || 'Unknown error'}`)
      }

      return false
    } finally {
      this.state.isLoading = false
      this.notifyListeners()
    }
  }

  async disconnectWallet(): Promise<void> {
    console.log('🔌 SimpleWallet: Disconnecting wallet...')

    this.state.address = null
    this.state.isConnected = false
    this.state.chainId = null

    this.notifyListeners()
    console.log('✅ SimpleWallet: Disconnected successfully')
  }

  async switchToPolygon(): Promise<boolean> {
    if (!this.ethereum) return false

    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon
      })
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Failed to add Polygon network:', addError)
          return false
        }
      }
      console.error('Failed to switch to Polygon:', switchError)
      return false
    }
  }

  private handleAccountsChanged(accounts: string[]): void {
    console.log('👤 SimpleWallet: Accounts changed', accounts)
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
    console.log('🔗 SimpleWallet: Chain changed', chainId)
    this.state.chainId = parseInt(chainId, 16)
    this.notifyListeners()
  }

  subscribe(listener: (state: SimpleWalletState) => void): () => void {
    this.listeners.push(listener)
    listener(this.state)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }))
  }

  getState(): SimpleWalletState {
    return { ...this.state }
  }

  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
}