import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (data: unknown) => void) => void
      send: (method: string, params: unknown[]) => Promise<string[]>
    }
  }
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  provider: ethers.BrowserProvider | null
}

export class WalletService {
  private static instance: WalletService
  private state: WalletState = {
    isConnected: false,
    address: null,
    chainId: null,
    provider: null,
  }
  private listeners: ((state: WalletState) => void)[] = []

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  subscribe(listener: (state: WalletState) => void) {
    this.listeners.push(listener)
    // Immediately call with current state
    listener(this.state)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  async connectMetaMask(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask to connect.')
        return false
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])

      if (accounts.length === 0) {
        return false
      }

      const network = await provider.getNetwork()

      this.state = {
        isConnected: true,
        address: accounts[0],
        chainId: Number(network.chainId),
        provider,
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          this.disconnect()
        } else {
          this.state.address = accounts[0]
          this.notifyListeners()
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.state.chainId = parseInt(chainId, 16)
        this.notifyListeners()
      })

      this.notifyListeners()
      return true
    } catch (error) {
      console.error('Failed to connect MetaMask:', error)
      return false
    }
  }

  async switchToPolygon(): Promise<boolean> {
    try {
      if (!window.ethereum) return false

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      })
      return true
    } catch (error: unknown) {
      // If the chain hasn't been added to MetaMask
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
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
      console.error('Failed to switch to Polygon:', error)
      return false
    }
  }

  disconnect() {
    this.state = {
      isConnected: false,
      address: null,
      chainId: null,
      provider: null,
    }
    this.notifyListeners()
  }

  async sendTip(toAddress: string, amount: string): Promise<string | null> {
    try {
      if (!this.state.provider || !this.state.address) {
        throw new Error('Wallet not connected')
      }

      const signer = await this.state.provider.getSigner()
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      })

      return tx.hash
    } catch (error) {
      console.error('Failed to send tip:', error)
      return null
    }
  }

  formatAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  getState(): WalletState {
    return { ...this.state }
  }
}