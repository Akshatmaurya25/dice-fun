"use client"

import { ethers } from 'ethers'

// Kadena EVM Network Configuration
export const KADENA_EVM_CONFIG = {
  chainId: 5920,
  chainName: 'Kadena Chainweb EVM Testnet 20',
  rpcUrl: 'https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc',
  blockExplorerUrl: 'http://chain-20.evm-testnet-blockscout.chainweb.com',
  nativeCurrency: {
    name: 'KDA',
    symbol: 'KDA',
    decimals: 18
  },
  faucetUrl: 'https://faucet.evm-testnet.chainweb.com/'
}

// DiceTipping Contract ABI (essential functions only)
export const DICE_TIPPING_ABI = [
  // Events
  "event TipSent(address indexed from, address indexed to, uint256 amount, string message, uint256 timestamp, bytes32 indexed tipId)",
  "event StreamTip(address indexed from, address indexed streamer, string indexed streamId, uint256 amount, string message, uint256 timestamp, bytes32 indexed tipId)",
  "event Donation(address indexed from, address indexed to, uint256 amount, string purpose, string message, uint256 timestamp, bytes32 indexed donationId)",

  // Main functions
  "function sendTip(address _to, string calldata _message) external payable",
  "function sendStreamTip(address _streamer, string calldata _streamId, string calldata _message) external payable",
  "function makeDonation(address _to, string calldata _purpose, string calldata _message) external payable",

  // View functions
  "function getUserStats(address _user) external view returns (tuple(uint256 totalTipsSent, uint256 totalTipsReceived, uint256 totalDonationsSent, uint256 totalDonationsReceived, uint256 tipCount, uint256 donationCount))",
  "function getStreamTips(string calldata _streamId) external view returns (bytes32[] memory)",
  "function getStreamTipCount(string calldata _streamId) external view returns (uint256)",
  "function getTotalTips() external view returns (uint256)",
  "function getTotalDonations() external view returns (uint256)",
  "function getRecentTips(uint256 _limit) external view returns (bytes32[] memory)",
  "function getRecentDonations(uint256 _limit) external view returns (bytes32[] memory)",

  // Contract configuration
  "function platformFeePercentage() external view returns (uint256)",
  "function minimumTipAmount() external view returns (uint256)",
  "function minimumDonationAmount() external view returns (uint256)",

  // Tip and donation data
  "function tips(bytes32) external view returns (tuple(address from, address to, uint256 amount, string message, uint256 timestamp, bool isStreamTip, string streamId))",
  "function donations(bytes32) external view returns (tuple(address from, address to, uint256 amount, string purpose, string message, uint256 timestamp))"
]

export interface UserStats {
  totalTipsSent: string
  totalTipsReceived: string
  totalDonationsSent: string
  totalDonationsReceived: string
  tipCount: string
  donationCount: string
}

export interface TipData {
  from: string
  to: string
  amount: string
  message: string
  timestamp: string
  isStreamTip: boolean
  streamId: string
}

export interface DonationData {
  from: string
  to: string
  amount: string
  purpose: string
  message: string
  timestamp: string
}

export class KadenaEVMService {
  private static instance: KadenaEVMService
  private provider: ethers.providers.Web3Provider | null = null
  private contract: ethers.Contract | null = null
  private contractAddress: string = '' // Will be set after deployment

  static getInstance(): KadenaEVMService {
    if (!KadenaEVMService.instance) {
      KadenaEVMService.instance = new KadenaEVMService()
    }
    return KadenaEVMService.instance
  }

  setContractAddress(address: string) {
    this.contractAddress = address
    this.initializeContract()
  }

  async initializeProvider(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask not detected')
      return false
    }

    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      await this.ensureKadenaNetwork()
      this.initializeContract()
      return true
    } catch (error) {
      console.error('Failed to initialize provider:', error)
      return false
    }
  }

  private initializeContract() {
    if (!this.provider || !this.contractAddress) return

    this.contract = new ethers.Contract(
      this.contractAddress,
      DICE_TIPPING_ABI,
      this.provider.getSigner()
    )
  }

  async ensureKadenaNetwork(): Promise<boolean> {
    if (!this.provider) return false

    try {
      const network = await this.provider.getNetwork()

      if (network.chainId !== KADENA_EVM_CONFIG.chainId) {
        await this.switchToKadenaNetwork()
      }

      return true
    } catch (error) {
      console.error('Failed to ensure Kadena network:', error)
      return false
    }
  }

  async switchToKadenaNetwork(): Promise<boolean> {
    if (!window.ethereum) return false

    try {
      // Try to switch to Kadena EVM network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${KADENA_EVM_CONFIG.chainId.toString(16)}` }]
      })
      return true
    } catch (switchError: any) {
      // Network not added to wallet, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${KADENA_EVM_CONFIG.chainId.toString(16)}`,
              chainName: KADENA_EVM_CONFIG.chainName,
              nativeCurrency: KADENA_EVM_CONFIG.nativeCurrency,
              rpcUrls: [KADENA_EVM_CONFIG.rpcUrl],
              blockExplorerUrls: [KADENA_EVM_CONFIG.blockExplorerUrl]
            }]
          })
          return true
        } catch (addError) {
          console.error('Failed to add Kadena network:', addError)
          return false
        }
      }
      console.error('Failed to switch to Kadena network:', switchError)
      return false
    }
  }

  async sendTip(to: string, amount: string, message: string): Promise<string | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.contract.sendTip(to, message, {
        value: ethers.utils.parseEther(amount)
      })

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Failed to send tip:', error)
      throw error
    }
  }

  async sendStreamTip(streamer: string, streamId: string, amount: string, message: string): Promise<string | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.contract.sendStreamTip(streamer, streamId, message, {
        value: ethers.utils.parseEther(amount)
      })

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Failed to send stream tip:', error)
      throw error
    }
  }

  async makeDonation(to: string, amount: string, purpose: string, message: string): Promise<string | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.contract.makeDonation(to, purpose, message, {
        value: ethers.utils.parseEther(amount)
      })

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Failed to make donation:', error)
      throw error
    }
  }

  async getUserStats(address: string): Promise<UserStats | null> {
    if (!this.contract) return null

    try {
      const stats = await this.contract.getUserStats(address)
      return {
        totalTipsSent: ethers.utils.formatEther(stats.totalTipsSent),
        totalTipsReceived: ethers.utils.formatEther(stats.totalTipsReceived),
        totalDonationsSent: ethers.utils.formatEther(stats.totalDonationsSent),
        totalDonationsReceived: ethers.utils.formatEther(stats.totalDonationsReceived),
        tipCount: stats.tipCount.toString(),
        donationCount: stats.donationCount.toString()
      }
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return null
    }
  }

  async getStreamTipCount(streamId: string): Promise<number> {
    if (!this.contract) return 0

    try {
      const count = await this.contract.getStreamTipCount(streamId)
      return count.toNumber()
    } catch (error) {
      console.error('Failed to get stream tip count:', error)
      return 0
    }
  }

  async getContractInfo(): Promise<any> {
    if (!this.contract) return null

    try {
      const [platformFee, minTip, minDonation, totalTips, totalDonations] = await Promise.all([
        this.contract.platformFeePercentage(),
        this.contract.minimumTipAmount(),
        this.contract.minimumDonationAmount(),
        this.contract.getTotalTips(),
        this.contract.getTotalDonations()
      ])

      return {
        platformFeePercentage: platformFee.toNumber() / 100, // Convert basis points to percentage
        minimumTipAmount: ethers.utils.formatEther(minTip),
        minimumDonationAmount: ethers.utils.formatEther(minDonation),
        totalTips: totalTips.toNumber(),
        totalDonations: totalDonations.toNumber(),
        contractAddress: this.contractAddress
      }
    } catch (error) {
      console.error('Failed to get contract info:', error)
      return null
    }
  }

  // Listen to contract events
  onTipSent(callback: (event: any) => void) {
    if (!this.contract) return

    this.contract.on('TipSent', callback)
  }

  onStreamTip(callback: (event: any) => void) {
    if (!this.contract) return

    this.contract.on('StreamTip', callback)
  }

  onDonation(callback: (event: any) => void) {
    if (!this.contract) return

    this.contract.on('Donation', callback)
  }

  removeAllListeners() {
    if (!this.contract) return
    this.contract.removeAllListeners()
  }

  // Utility functions
  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  isValidAddress(address: string): boolean {
    try {
      ethers.utils.getAddress(address)
      return true
    } catch {
      return false
    }
  }

  parseEther(amount: string): string {
    try {
      return ethers.utils.parseEther(amount).toString()
    } catch {
      return '0'
    }
  }

  formatEther(amount: string): string {
    try {
      return ethers.utils.formatEther(amount)
    } catch {
      return '0'
    }
  }
}