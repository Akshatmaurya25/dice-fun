"use client"

import { Core } from "@walletconnect/core"
import { WalletKit, WalletKitTypes } from "@reown/walletkit"
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils"
import { ethers } from "ethers"
import DatabaseService from '@/lib/database'

export interface WalletConnectWalletState {
  isConnected: boolean
  isLoading: boolean
  isReady: boolean
  address: string | null
  chainId: number | null
  sessions: WalletKitTypes.SessionTypes.Struct[]
}

export class WalletConnectWalletService {
  private static instance: WalletConnectWalletService
  private walletKit: WalletKit | null = null
  private core: Core | null = null
  private state: WalletConnectWalletState = {
    isConnected: false,
    isLoading: false,
    isReady: false,
    address: null,
    chainId: null,
    sessions: [],
  }
  private listeners: ((state: WalletConnectWalletState) => void)[] = []
  private ethereum: any = null
  private provider: ethers.BrowserProvider | null = null
  private database: DatabaseService
  private boundAccountsChanged: (accounts: string[]) => void
  private boundChainChanged: (chainId: string) => void

  constructor() {
    this.database = DatabaseService.getInstance()

    // Bind event handlers once to maintain consistent references
    this.boundAccountsChanged = this.handleAccountsChanged.bind(this)
    this.boundChainChanged = this.handleChainChanged.bind(this)
  }

  static getInstance(): WalletConnectWalletService {
    if (!WalletConnectWalletService.instance) {
      WalletConnectWalletService.instance = new WalletConnectWalletService()
    }
    return WalletConnectWalletService.instance
  }

  async initialize(): Promise<void> {
    console.log('🔄 Initializing wallet service...')

    // Always start with clean state
    this.state.isLoading = true
    this.state.isReady = false
    this.notifyListeners()

    try {
      // Detect and prioritize MetaMask
      const preferredWallet = this.detectPreferredWallet()

      if (preferredWallet) {
        console.log('✅ Wallet detected:', preferredWallet.isMetaMask ? 'MetaMask' : 'Other wallet')
        this.ethereum = preferredWallet
        this.provider = new ethers.BrowserProvider(this.ethereum)

        // Check existing connection with timeout
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection check timeout')), 5000)
          )

          const accountsPromise = this.ethereum.request({ method: 'eth_accounts' })
          const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[]

          if (accounts && accounts.length > 0) {
            this.state.address = accounts[0]
            const chainId = await this.ethereum.request({ method: 'eth_chainId' })
            this.state.chainId = parseInt(chainId as string, 16)
            this.state.isConnected = true
            console.log('✅ Existing wallet connection found:', this.state.address)
          } else {
            console.log('ℹ️ No existing wallet connection')
          }
        } catch (err) {
          console.warn('⚠️ Failed to check existing connection:', err)
          // Don't fail initialization just because we can't check existing connection
        }

        // Set up event listeners
        this.setupWalletEventListeners()
      } else {
        console.log('ℹ️ No wallet detected')
      }

      // Always mark as ready regardless of wallet detection
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()

      console.log('✅ Wallet service initialized successfully')

      // Initialize WalletConnect in the background (non-blocking)
      this.initializeWalletConnectAsync().catch(err =>
        console.warn('⚠️ WalletConnect initialization failed:', err)
      )

    } catch (error) {
      console.error('❌ Failed to initialize wallet service:', error)
      // Always mark as ready even on error to prevent infinite loading
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()
    }
  }

  private detectPreferredWallet(): any {
    if (typeof window === 'undefined') {
      console.log('🌐 Window not available (SSR)')
      return null
    }

    if (!window.ethereum) {
      console.log('🚫 No ethereum provider found')
      return null
    }

    // Check for MetaMask specifically first
    if (window.ethereum.isMetaMask) {
      console.log('🦊 MetaMask detected as primary provider')
      return window.ethereum
    }

    // Check for multiple providers
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      console.log('🔍 Multiple providers detected, looking for MetaMask...')
      const metamask = window.ethereum.providers.find((provider: any) => provider.isMetaMask)
      if (metamask) {
        console.log('🦊 MetaMask found in providers array')
        return metamask
      }

      // If no MetaMask, return the first provider
      console.log('📦 Using first available provider')
      return window.ethereum.providers[0]
    }

    // Fallback to general ethereum provider
    console.log('🔗 Using default ethereum provider')
    return window.ethereum
  }

  private setupWalletEventListeners(): void {
    if (!this.ethereum) return

    try {
      // Remove existing listeners to prevent duplicates
      if (this.ethereum.removeListener) {
        this.ethereum.removeListener('accountsChanged', this.boundAccountsChanged)
        this.ethereum.removeListener('chainChanged', this.boundChainChanged)
      }

      // Add new listeners using bound references
      this.ethereum.on('accountsChanged', this.boundAccountsChanged)
      this.ethereum.on('chainChanged', this.boundChainChanged)
      console.log('👂 Wallet event listeners set up')
    } catch (error) {
      console.warn('⚠️ Failed to set up wallet event listeners:', error)
    }
  }

  private async initializeWalletConnectAsync(): Promise<void> {
    try {
      console.log('🔄 Initializing WalletConnect...')

      // Skip WalletConnect initialization if no project ID
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "c7bbcb0e4153fb9581712573298cdc67"
      if (!projectId || projectId === 'your-project-id-here') {
        console.log('⚠️ Skipping WalletConnect: No valid project ID')
        return
      }

      // Add timeout for WalletConnect initialization
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('WalletConnect initialization timeout')), 10000)
      )

      const initPromise = (async () => {
        // Initialize Core
        this.core = new Core({
          projectId,
        })

        // Initialize WalletKit
        this.walletKit = await WalletKit.init({
          core: this.core,
          metadata: {
            name: "Dice.fun Wallet",
            description: "Decentralized gaming and streaming platform wallet",
            url: typeof window !== 'undefined' ? window.location.origin : "https://dice.fun",
            icons: [`${typeof window !== 'undefined' ? window.location.origin : "https://dice.fun"}/favicon.ico`],
          },
        })

        // Set up WalletConnect event listeners
        this.setupWalletConnectEventListeners()
      })()

      await Promise.race([initPromise, timeoutPromise])

      console.log('✅ WalletConnect initialized successfully')

    } catch (error) {
      console.warn('⚠️ WalletConnect initialization failed (background):', error)
      // Don't throw here - the wallet should still work without WalletConnect
      this.walletKit = null
      this.core = null
    }
  }

  private setupWalletConnectEventListeners(): void {
    if (!this.walletKit) return

    // Session proposal handler
    this.walletKit.on('session_proposal', this.onSessionProposal.bind(this))

    // Session request handler
    this.walletKit.on('session_request', this.onSessionRequest.bind(this))

    // Session delete handler
    this.walletKit.on('session_delete', this.onSessionDelete.bind(this))

    // Authentication request handler
    this.walletKit.on('session_authenticate', this.onSessionAuthenticate.bind(this))
  }

  private async onSessionProposal(proposal: WalletKitTypes.SessionProposal): Promise<void> {
    try {
      if (!this.state.address) {
        // Auto-reject if no wallet connected
        await this.walletKit?.rejectSession({
          id: proposal.id,
          reason: getSdkError("USER_REJECTED"),
        })
        return
      }

      // Build approved namespaces
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces: {
          eip155: {
            chains: ["eip155:137"], // Polygon
            methods: [
              "eth_sendTransaction",
              "personal_sign",
              "eth_signTypedData",
              "eth_signTypedData_v4",
              "eth_accounts",
              "eth_requestAccounts",
            ],
            events: ["chainChanged", "accountsChanged"],
            accounts: [`eip155:137:${this.state.address}`],
          },
        },
      })

      // Auto-approve session
      const session = await this.walletKit?.approveSession({
        id: proposal.id,
        namespaces: approvedNamespaces,
      })

      if (session) {
        this.state.sessions = this.walletKit?.getActiveSessions() ? Object.values(this.walletKit.getActiveSessions()) : []
        this.notifyListeners()
      }

    } catch (error) {
      console.error('Failed to handle session proposal:', error)
      await this.walletKit?.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED"),
      })
    }
  }

  private async onSessionRequest(event: WalletKitTypes.SessionRequest): Promise<void> {
    const { topic, params, id } = event
    const { request } = params

    try {
      let result: any

      switch (request.method) {
        case 'personal_sign':
          result = await this.handlePersonalSign(request.params)
          break
        case 'eth_sendTransaction':
          result = await this.handleSendTransaction(request.params[0])
          break
        case 'eth_signTypedData':
        case 'eth_signTypedData_v4':
          result = await this.handleSignTypedData(request.params)
          break
        case 'eth_accounts':
          result = [this.state.address]
          break
        case 'eth_requestAccounts':
          result = [this.state.address]
          break
        default:
          throw new Error(`Unsupported method: ${request.method}`)
      }

      await this.walletKit?.respondSessionRequest({
        topic,
        response: { id, result, jsonrpc: "2.0" },
      })

    } catch (error) {
      console.error('Failed to handle session request:', error)
      await this.walletKit?.respondSessionRequest({
        topic,
        response: {
          id,
          jsonrpc: "2.0",
          error: {
            code: 5000,
            message: error instanceof Error ? error.message : "User rejected",
          },
        },
      })
    }
  }

  private async onSessionDelete(event: { topic: string }): Promise<void> {
    this.state.sessions = this.walletKit?.getActiveSessions() ? Object.values(this.walletKit.getActiveSessions()) : []
    this.notifyListeners()
  }

  private async onSessionAuthenticate(payload: any): Promise<void> {
    // Handle authentication requests
    console.log('Authentication request received:', payload)
    // For now, auto-reject auth requests
    await this.walletKit?.rejectSessionAuthenticate({
      id: payload.id,
      reason: getSdkError("USER_REJECTED"),
    })
  }

  private async handlePersonalSign(params: any[]): Promise<string> {
    if (!this.provider) throw new Error('No provider available')

    const [message, address] = params
    const signer = await this.provider.getSigner()
    return await signer.signMessage(ethers.toUtf8String(message))
  }

  private async handleSendTransaction(transaction: any): Promise<string> {
    if (!this.provider) throw new Error('No provider available')

    const signer = await this.provider.getSigner()
    const tx = await signer.sendTransaction(transaction)
    return tx.hash
  }

  private async handleSignTypedData(params: any[]): Promise<string> {
    if (!this.provider) throw new Error('No provider available')

    const [address, typedData] = params
    const signer = await this.provider.getSigner()
    return await signer.signTypedData(
      JSON.parse(typedData).domain,
      JSON.parse(typedData).types,
      JSON.parse(typedData).message
    )
  }

  private handleAccountsChanged(accounts: string[]): void {
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
    this.state.chainId = parseInt(chainId, 16)
    this.notifyListeners()
  }

  async connectWallet(): Promise<boolean> {
    console.log('🔗 Attempting to connect wallet...')

    try {
      // Re-detect wallet if not available
      if (!this.ethereum) {
        const preferredWallet = this.detectPreferredWallet()
        if (preferredWallet) {
          this.ethereum = preferredWallet
          this.provider = new ethers.BrowserProvider(this.ethereum)
          this.setupWalletEventListeners()
        } else {
          const message = 'No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.'
          console.error('❌', message)
          alert(message)
          return false
        }
      }

      this.state.isLoading = true
      this.notifyListeners()

      // Add timeout to prevent indefinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout - Please check your wallet')), 15000) // 15 second timeout
      })

      const connectPromise = this.ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log('⏳ Waiting for user approval...')
      const accounts = await Promise.race([connectPromise, timeoutPromise]) as string[]

      if (accounts && accounts.length > 0) {
        this.state.address = accounts[0]
        const chainId = await this.ethereum.request({ method: 'eth_chainId' })
        this.state.chainId = parseInt(chainId as string, 16)
        this.state.isConnected = true

        console.log('✅ Wallet connected:', this.state.address, 'Chain:', this.state.chainId)

        // Switch to Polygon if not already on it
        if (this.state.chainId !== 137) {
          console.log('🔄 Switching to Polygon...')
          await this.switchToPolygon()
        }

        this.state.isLoading = false
        this.notifyListeners()
        return true
      }

      console.log('❌ No accounts returned')
      this.state.isLoading = false
      this.notifyListeners()
      return false

    } catch (error) {
      console.error('❌ Failed to connect wallet:', error)

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      if (errorMessage.includes('timeout')) {
        alert('Connection timeout. Please try again and make sure to approve the connection in your wallet.')
      } else if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        alert('Connection rejected. Please approve the connection in your wallet to continue.')
      } else {
        alert(`Failed to connect wallet: ${errorMessage}`)
      }

      this.state.isLoading = false
      this.notifyListeners()
      return false
    }
  }

  async disconnectWallet(): Promise<void> {
    console.log('🔌 Disconnecting wallet...')

    try {
      // Clear internal state first
      this.state.address = null
      this.state.isConnected = false
      this.state.chainId = null
      this.state.sessions = []

      // Note: We can't actually force disconnect from MetaMask programmatically
      // MetaMask doesn't provide a disconnect method for security reasons
      // The user needs to disconnect manually from MetaMask or revoke permissions

      // Disconnect all WalletConnect sessions
      if (this.walletKit) {
        try {
          const sessions = this.walletKit.getActiveSessions()
          const sessionArray = Object.values(sessions)

          if (sessionArray.length > 0) {
            console.log(`🔄 Disconnecting ${sessionArray.length} WalletConnect sessions...`)

            for (const session of sessionArray) {
              await this.walletKit.disconnectSession({
                topic: session.topic,
                reason: getSdkError("USER_DISCONNECTED"),
              })
            }
            console.log('✅ WalletConnect sessions disconnected')
          }
        } catch (wcError) {
          console.warn('⚠️ Failed to disconnect WalletConnect sessions:', wcError)
        }
      }

      // Remove event listeners to prevent memory leaks
      if (this.ethereum && this.ethereum.removeListener) {
        try {
          this.ethereum.removeListener('accountsChanged', this.boundAccountsChanged)
          this.ethereum.removeListener('chainChanged', this.boundChainChanged)
          console.log('🧹 Event listeners removed')
        } catch (error) {
          console.warn('⚠️ Failed to remove event listeners:', error)
        }
      }

      // Clear provider references
      this.provider = null

      // Notify listeners of state change
      this.notifyListeners()

      console.log('✅ Wallet disconnected successfully')

      // Note: For full disconnection, user needs to manually disconnect from MetaMask
      // This is by design for security reasons

    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error)

      // Still update state even if there were errors
      this.state.address = null
      this.state.isConnected = false
      this.state.chainId = null
      this.state.sessions = []
      this.notifyListeners()
    }
  }

  async switchToPolygon(): Promise<boolean> {
    if (!this.ethereum) return false

    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon chain ID
      })
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
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

  async sendTip(toAddress: string, amount: string, streamId?: string, message?: string): Promise<string | null> {
    try {
      if (!this.state.isConnected || !this.provider) {
        throw new Error('Wallet not connected')
      }

      const signer = await this.provider.getSigner()
      const amountInWei = ethers.parseEther(amount)

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: amountInWei,
      })

      // Record the tip in the database
      if (streamId && this.state.address) {
        await this.database.createTip({
          stream_id: streamId,
          from_address: this.state.address,
          to_address: toAddress,
          amount: amount,
          message: message,
          tx_hash: tx.hash,
        })
      }

      return tx.hash
    } catch (error) {
      console.error('Failed to send tip:', error)
      return null
    }
  }

  async pairWithDapp(uri: string): Promise<boolean> {
    try {
      if (!this.walletKit) {
        await this.initialize()
      }

      await this.walletKit?.pair({ uri })
      return true
    } catch (error) {
      console.error('Failed to pair with dApp:', error)
      return false
    }
  }

  subscribe(listener: (state: WalletConnectWalletState) => void): () => void {
    this.listeners.push(listener)
    listener(this.state)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state))
  }

  getState(): WalletConnectWalletState {
    return { ...this.state }
  }

  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  getSessions(): WalletKitTypes.SessionTypes.Struct[] {
    return this.state.sessions
  }
}