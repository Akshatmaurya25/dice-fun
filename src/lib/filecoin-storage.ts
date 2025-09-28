"use client"

import { Synapse, RPC_URLS } from '@filoz/synapse-sdk'
import { ethers } from 'ethers'

export interface FilecoinStorageResult {
  pieceCid: string
  size: number
  success: boolean
  error?: string
}

export interface FilecoinStorageOptions {
  useTestnet?: boolean
  privateKey?: string
  provider?: ethers.Provider
}

export class FilecoinStorageService {
  private static instance: FilecoinStorageService | null = null
  private synapse: any = null
  private isInitialized = false

  static getInstance(): FilecoinStorageService {
    if (!FilecoinStorageService.instance) {
      FilecoinStorageService.instance = new FilecoinStorageService()
    }
    return FilecoinStorageService.instance
  }

  async initialize(options: FilecoinStorageOptions = {}): Promise<boolean> {
    if (this.isInitialized && this.synapse) {
      return true
    }

    try {
      console.log('🌍 Initializing Filecoin storage service...')

      const { useTestnet = true, privateKey, provider } = options

      // Use Calibration testnet by default for development
      const rpcURL = useTestnet
        ? RPC_URLS.calibration.websocket
        : RPC_URLS.mainnet.websocket

      console.log(`🔗 Connecting to ${useTestnet ? 'Calibration Testnet' : 'Mainnet'}`)

      // Create Synapse instance
      if (provider) {
        // Use browser provider (MetaMask)
        this.synapse = await Synapse.create({
          provider,
          rpcURL
        })
      } else if (privateKey) {
        // Use private key
        this.synapse = await Synapse.create({
          privateKey,
          rpcURL
        })
      } else {
        // Try to use MetaMask if available
        if (typeof window !== 'undefined' && window.ethereum) {
          const browserProvider = new ethers.BrowserProvider(window.ethereum)
          this.synapse = await Synapse.create({
            provider: browserProvider,
            rpcURL
          })
        } else {
          throw new Error('No wallet provider available')
        }
      }

      this.isInitialized = true
      console.log('✅ Filecoin storage service initialized successfully')
      return true

    } catch (error) {
      console.error('❌ Failed to initialize Filecoin storage:', error)
      this.isInitialized = false
      return false
    }
  }

  async uploadFile(data: Uint8Array, filename?: string): Promise<FilecoinStorageResult> {
    if (!this.isInitialized || !this.synapse) {
      const initialized = await this.initialize()
      if (!initialized) {
        return {
          pieceCid: '',
          size: 0,
          success: false,
          error: 'Failed to initialize Filecoin storage service'
        }
      }
    }

    try {
      console.log(`📤 Uploading ${filename || 'file'} to Filecoin (${data.length} bytes)...`)

      // Check size constraints
      if (data.length < 127) {
        return {
          pieceCid: '',
          size: data.length,
          success: false,
          error: 'File too small (minimum 127 bytes)'
        }
      }

      if (data.length > 209715200) { // 200 MiB
        return {
          pieceCid: '',
          size: data.length,
          success: false,
          error: 'File too large (maximum 200 MiB)'
        }
      }

      // Upload to Filecoin
      const result = await this.synapse.storage.upload(data)

      console.log(`✅ File uploaded successfully! PieceCID: ${result.pieceCid}`)

      return {
        pieceCid: result.pieceCid,
        size: result.size || data.length,
        success: true
      }

    } catch (error: any) {
      console.error('❌ Filecoin upload failed:', error)
      return {
        pieceCid: '',
        size: data.length,
        success: false,
        error: error.message || 'Upload failed'
      }
    }
  }

  async downloadFile(pieceCid: string): Promise<Uint8Array | null> {
    if (!this.isInitialized || !this.synapse) {
      const initialized = await this.initialize()
      if (!initialized) {
        console.error('❌ Cannot download: Filecoin storage not initialized')
        return null
      }
    }

    try {
      console.log(`📥 Downloading from Filecoin: ${pieceCid}`)

      const data = await this.synapse.storage.download(pieceCid)

      console.log(`✅ File downloaded successfully (${data.length} bytes)`)
      return data

    } catch (error: any) {
      console.error('❌ Filecoin download failed:', error)
      return null
    }
  }

  async getStorageInfo(): Promise<any> {
    if (!this.isInitialized || !this.synapse) {
      return null
    }

    try {
      const info = await this.synapse.getStorageInfo()
      return info
    } catch (error) {
      console.error('❌ Failed to get storage info:', error)
      return null
    }
  }

  async checkBalance(): Promise<{ walletBalance?: string, paymentsBalance?: string }> {
    if (!this.isInitialized || !this.synapse) {
      return {}
    }

    try {
      const walletBalance = await this.synapse.payments.walletBalance()
      const paymentsBalance = await this.synapse.payments.balance()

      return {
        walletBalance: ethers.formatUnits(walletBalance, 18),
        paymentsBalance: ethers.formatUnits(paymentsBalance, 18)
      }
    } catch (error) {
      console.error('❌ Failed to check balance:', error)
      return {}
    }
  }

  // Convert file to Uint8Array for upload
  static async fileToUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        resolve(new Uint8Array(arrayBuffer))
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  // Convert Uint8Array to blob URL for display
  static uint8ArrayToBlobUrl(data: Uint8Array, mimeType: string = 'application/octet-stream'): string {
    const blob = new Blob([data], { type: mimeType })
    return URL.createObjectURL(blob)
  }

  // Clean up blob URLs
  static revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url)
  }

  async cleanup(): Promise<void> {
    if (this.synapse) {
      try {
        const provider = this.synapse.getProvider()
        if (provider && typeof provider.destroy === 'function') {
          await provider.destroy()
        }
      } catch (error) {
        console.error('❌ Failed to cleanup Filecoin storage:', error)
      }
    }
    this.synapse = null
    this.isInitialized = false
  }
}