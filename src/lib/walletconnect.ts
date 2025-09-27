"use client"

import { Core } from "@walletconnect/core"
import { WalletKit, WalletKitTypes } from "@reown/walletkit"
import { buildApprovedNamespaces, getSdkError, populateAuthPayload, buildAuthObject } from "@walletconnect/utils"

export interface WalletConnectState {
  isInitialized: boolean
  activeSessions: any[]
  pendingRequests: any[]
  pairings: any[]
}

export class WalletConnectService {
  private static instance: WalletConnectService
  private walletKit: WalletKit | null = null
  private core: Core | null = null
  private state: WalletConnectState = {
    isInitialized: false,
    activeSessions: [],
    pendingRequests: [],
    pairings: [],
  }
  private listeners: ((state: WalletConnectState) => void)[] = []
  private walletAddress: string | null = null
  private signMessageCallback: ((message: string) => Promise<string>) | null = null

  static getInstance(): WalletConnectService {
    if (!WalletConnectService.instance) {
      WalletConnectService.instance = new WalletConnectService()
    }
    return WalletConnectService.instance
  }

  async initialize(walletAddress: string, signMessage: (message: string) => Promise<string>) {
    if (this.state.isInitialized) return

    try {
      this.walletAddress = walletAddress
      this.signMessageCallback = signMessage

      // Initialize Core
      this.core = new Core({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "c7bbcb0e4153fb9581712573298cdc67",
      })

      // Initialize WalletKit
      this.walletKit = await WalletKit.init({
        core: this.core,
        metadata: {
          name: "KadeLive Wallet",
          description: "Decentralized streaming platform wallet",
          url: "https://kadelive.com",
          icons: ["https://kadelive.com/logo.png"],
        },
      })

      // Set up event listeners
      this.setupEventListeners()

      this.state.isInitialized = true
      this.updateState()

      console.log("✅ WalletConnect initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize WalletConnect:", error)
      throw error
    }
  }

  private setupEventListeners() {
    if (!this.walletKit) return

    // Session proposal
    this.walletKit.on("session_proposal", this.onSessionProposal.bind(this))

    // Session request
    this.walletKit.on("session_request", this.onSessionRequest.bind(this))

    // Session authenticate (One-click Auth)
    this.walletKit.on("session_authenticate", this.onSessionAuthenticate.bind(this))

    // Session delete
    this.walletKit.on("session_delete", this.onSessionDelete.bind(this))

    // Proposal expire
    this.walletKit.on("proposal_expire", this.onProposalExpire.bind(this))

    // Session request expire
    this.walletKit.on("session_request_expire", this.onSessionRequestExpire.bind(this))
  }

  private async onSessionProposal(proposal: WalletKitTypes.SessionProposal) {
    console.log("📝 Session proposal received:", proposal)

    try {
      // Build approved namespaces with our supported chains and methods
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces: {
          eip155: {
            chains: ["eip155:137"], // Polygon
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
              "eth_signTypedData_v4",
              "wallet_switchEthereumChain",
              "wallet_addEthereumChain",
            ],
            events: ["chainChanged", "accountsChanged"],
            accounts: [`eip155:137:${this.walletAddress}`],
          },
        },
      })

      // Auto-approve the session for better UX
      const session = await this.walletKit!.approveSession({
        id: proposal.id,
        namespaces: approvedNamespaces,
      })

      this.updateActiveSessions()

      // Show notification to user
      this.showNotification("🔗 Connected to " + proposal.params.proposer.metadata.name, "success")

      console.log("✅ Session approved:", session)
    } catch (error) {
      console.error("❌ Failed to approve session:", error)

      // Reject the session
      await this.walletKit!.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED"),
      })

      this.showNotification("❌ Failed to connect to app", "error")
    }
  }

  private async onSessionRequest(event: WalletKitTypes.SessionRequest) {
    console.log("📬 Session request received:", event)

    const { topic, params, id } = event
    const { request } = params
    const method = request.method

    try {
      let result: any

      switch (method) {
        case "personal_sign":
          result = await this.handlePersonalSign(request.params)
          break
        case "eth_sign":
          result = await this.handleEthSign(request.params)
          break
        case "eth_signTypedData":
        case "eth_signTypedData_v4":
          result = await this.handleSignTypedData(request.params)
          break
        case "eth_sendTransaction":
          result = await this.handleSendTransaction(request.params)
          break
        case "wallet_switchEthereumChain":
          result = await this.handleSwitchChain(request.params)
          break
        case "wallet_addEthereumChain":
          result = await this.handleAddChain(request.params)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      // Respond with success
      await this.walletKit!.respondSessionRequest({
        topic,
        response: {
          id,
          result,
          jsonrpc: "2.0",
        },
      })

      this.showNotification(`✅ ${method} completed`, "success")
    } catch (error) {
      console.error(`❌ Failed to handle ${method}:`, error)

      // Respond with error
      await this.walletKit!.respondSessionRequest({
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

      this.showNotification(`❌ ${method} failed`, "error")
    }
  }

  private async onSessionAuthenticate(payload: any) {
    console.log("🔐 Session authenticate received:", payload)

    try {
      // Supported chains and methods for authentication
      const supportedChains = ["eip155:137"]
      const supportedMethods = ["personal_sign", "eth_sendTransaction", "eth_signTypedData"]

      // Populate authentication payload
      const authPayload = populateAuthPayload({
        authPayload: payload.params.authPayload,
        chains: supportedChains,
        methods: supportedMethods,
      })

      // Format authentication message
      const iss = `eip155:137:${this.walletAddress}`
      const message = this.walletKit!.formatAuthMessage({
        request: authPayload,
        iss,
      })

      // Sign the authentication message
      if (!this.signMessageCallback) {
        throw new Error("Sign message callback not set")
      }

      const signature = await this.signMessageCallback(message)

      // Build authentication object
      const auth = buildAuthObject(
        authPayload,
        {
          t: "eip191",
          s: signature,
        },
        iss
      )

      // Approve authentication
      await this.walletKit!.approveSessionAuthenticate({
        id: payload.id,
        auths: [auth],
      })

      this.updateActiveSessions()
      this.showNotification("🔐 Authentication successful", "success")
    } catch (error) {
      console.error("❌ Authentication failed:", error)

      // Reject authentication
      await this.walletKit!.rejectSessionAuthenticate({
        id: payload.id,
        reason: getSdkError("USER_REJECTED"),
      })

      this.showNotification("❌ Authentication failed", "error")
    }
  }

  private async onSessionDelete(event: any) {
    console.log("🗑️ Session deleted:", event)
    this.updateActiveSessions()
    this.showNotification("🔌 App disconnected", "info")
  }

  private onProposalExpire(event: any) {
    console.log("⏰ Proposal expired:", event)
    this.showNotification("⏰ Connection request expired", "warning")
  }

  private onSessionRequestExpire(event: any) {
    console.log("⏰ Session request expired:", event)
    this.showNotification("⏰ Request expired", "warning")
  }

  // Handler methods for different request types
  private async handlePersonalSign(params: any[]): Promise<string> {
    const [message, address] = params
    if (!this.signMessageCallback) {
      throw new Error("Sign message callback not set")
    }

    // Convert hex to UTF-8 if needed
    const messageToSign = message.startsWith("0x") ?
      Buffer.from(message.slice(2), "hex").toString("utf8") : message

    return await this.signMessageCallback(messageToSign)
  }

  private async handleEthSign(params: any[]): Promise<string> {
    const [address, message] = params
    return await this.handlePersonalSign([message, address])
  }

  private async handleSignTypedData(params: any[]): Promise<string> {
    const [address, typedData] = params
    // For now, convert typed data to string and sign
    const message = typeof typedData === "string" ? typedData : JSON.stringify(typedData)
    return await this.handlePersonalSign([message, address])
  }

  private async handleSendTransaction(params: any[]): Promise<string> {
    // This would integrate with your transaction sending logic
    throw new Error("Transaction sending not implemented yet")
  }

  private async handleSwitchChain(params: any[]): Promise<null> {
    // For now, we only support Polygon
    const [{ chainId }] = params
    if (chainId !== "0x89") {
      throw new Error("Only Polygon network is supported")
    }
    return null
  }

  private async handleAddChain(params: any[]): Promise<null> {
    // Auto-reject chain addition for security
    throw new Error("Adding new chains is not supported")
  }

  // Public methods
  async pair(uri: string) {
    if (!this.walletKit) {
      throw new Error("WalletConnect not initialized")
    }

    try {
      await this.walletKit.pair({ uri })
      this.showNotification("🔗 Pairing initiated...", "info")
    } catch (error) {
      console.error("❌ Pairing failed:", error)
      this.showNotification("❌ Pairing failed", "error")
      throw error
    }
  }

  async disconnectSession(topic: string) {
    if (!this.walletKit) return

    try {
      await this.walletKit.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      })
      this.updateActiveSessions()
      this.showNotification("🔌 Disconnected from app", "info")
    } catch (error) {
      console.error("❌ Failed to disconnect session:", error)
      throw error
    }
  }

  getActiveSessions() {
    return this.walletKit?.getActiveSessions() || {}
  }

  private updateActiveSessions() {
    const sessions = this.getActiveSessions()
    this.state.activeSessions = Object.values(sessions)
    this.updateState()
  }

  private updateState() {
    this.state = { ...this.state }
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: WalletConnectState) => void) {
    this.listeners.push(listener)
    listener(this.state)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private showNotification(message: string, type: "success" | "error" | "info" | "warning") {
    // This would integrate with your notification system
    console.log(`📢 ${type.toUpperCase()}: ${message}`)

    // For now, just show browser notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("KadeLive Wallet", { body: message })
      }
    }
  }

  getState(): WalletConnectState {
    return { ...this.state }
  }
}