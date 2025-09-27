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

  constructor() {
    this.database = DatabaseService.getInstance()
  }

  static getInstance(): WalletConnectWalletService {
    if (!WalletConnectWalletService.instance) {
      WalletConnectWalletService.instance = new WalletConnectWalletService()
    }
    return WalletConnectWalletService.instance
  }

  async initialize(): Promise<void> {
    if (this.walletKit) {
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()
      return
    }

    try {
      this.state.isLoading = true
      this.notifyListeners()

      // First check if MetaMask is available (this is immediate)
      if (typeof window !== 'undefined' && window.ethereum) {
        this.ethereum = window.ethereum
        this.provider = new ethers.BrowserProvider(this.ethereum)

        // Check if already connected (this is fast)
        try {
          const accounts = await this.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            this.state.address = accounts[0]
            this.state.chainId = parseInt(await this.ethereum.request({ method: 'eth_chainId' }), 16)
            this.state.isConnected = true
          }
        } catch (err) {
          console.warn('Failed to check existing connection:', err)
        }

        // Set up MetaMask event listeners immediately
        this.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this))
        this.ethereum.on('chainChanged', this.handleChainChanged.bind(this))
      }

      // Set ready state immediately - don't wait for WalletConnect
      this.state.isReady = true
      this.state.isLoading = false
      this.notifyListeners()

      // Initialize WalletConnect in the background (non-blocking)
      this.initializeWalletConnectAsync()

    } catch (error) {
      console.error('Failed to initialize wallet service:', error)
      this.state.isReady = true // Still mark as ready even if WalletConnect fails
      this.state.isLoading = false
      this.notifyListeners()
    }
  }

  private async initializeWalletConnectAsync(): Promise<void> {
    try {
      // Initialize Core
      this.core = new Core({
        projectId: "c7bbcb0e4153fb9581712573298cdc67",
      })

      // Initialize WalletKit
      this.walletKit = await WalletKit.init({
        core: this.core,
        metadata: {
          name: "Dice.fun Wallet",
          description: "Decentralized gaming and streaming platform wallet",
          url: "https://dice.fun",
          icons: ["https://dice.fun/icon.png"],
        },
      })

      // Set up WalletConnect event listeners
      this.setupWalletConnectEventListeners()

      console.log('WalletConnect initialized successfully')

    } catch (error) {
      console.error('Failed to initialize WalletConnect (background):', error)
      // Don't throw here - the wallet should still work without WalletConnect
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
    try {
      if (!this.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to connect.')
        return false
      }

      this.state.isLoading = true
      this.notifyListeners()

      // Add timeout to prevent indefinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 30000) // 30 second timeout
      })

      const connectPromise = this.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const accounts = await Promise.race([connectPromise, timeoutPromise])

      if (accounts.length > 0) {
        this.state.address = accounts[0]
        this.state.chainId = parseInt(await this.ethereum.request({ method: 'eth_chainId' }), 16)
        this.state.isConnected = true

        // Switch to Polygon if not already on it
        if (this.state.chainId !== 137) {
          await this.switchToPolygon()
        }

        this.state.isLoading = false
        this.notifyListeners()
        return true
      }

      this.state.isLoading = false
      this.notifyListeners()
      return false

    } catch (error) {
      console.error('Failed to connect wallet:', error)
      this.state.isLoading = false
      this.notifyListeners()
      return false
    }
  }

  async disconnectWallet(): Promise<void> {
    this.state.address = null
    this.state.isConnected = false
    this.state.chainId = null

    // Disconnect all WalletConnect sessions
    if (this.walletKit) {
      const sessions = this.walletKit.getActiveSessions()
      for (const session of Object.values(sessions)) {
        await this.walletKit.disconnectSession({
          topic: session.topic,
          reason: getSdkError("USER_DISCONNECTED"),
        })
      }
    }

    this.state.sessions = []
    this.notifyListeners()
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