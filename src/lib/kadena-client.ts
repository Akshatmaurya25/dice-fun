"use client"

import { createClient, Pact } from '@kadena/client'

// Kadena testnet configuration
export const KADENA_CONFIG = {
  networkId: 'testnet04',
  chainId: '1',
  host: 'https://api.testnet.chainweb.com',
  gasLimit: 150000,
  gasPrice: 0.00000001,
  ttl: 600
}

// Create Kadena client
export const kadenaClient = createClient(
  `${KADENA_CONFIG.host}/chainweb/0.0/${KADENA_CONFIG.networkId}/chain/${KADENA_CONFIG.chainId}/pact`
)

export interface TipRecord {
  from: string
  to: string
  amount: string
  streamId?: string
  message?: string
}

export class KadenaService {
  private static instance: KadenaService

  static getInstance(): KadenaService {
    if (!KadenaService.instance) {
      KadenaService.instance = new KadenaService()
    }
    return KadenaService.instance
  }

  // Send a tip using the deployed contract
  async sendTip(tip: TipRecord, senderKeypair?: { publicKey: string; secretKey: string }): Promise<string | null> {
    try {
      const command = Pact.builder
        .execution(
          tip.streamId
            ? `(free.dice-tipping.stream-tip "${tip.from}" "${tip.to}" "${tip.streamId}" ${tip.amount} "${tip.message || ""}")`
            : `(free.dice-tipping.tip "${tip.from}" "${tip.to}" ${tip.amount} "${tip.message || ""}")`
        )
        .addSigner(tip.from, (withCapability) => [
          withCapability('coin.GAS'),
          withCapability(
            tip.streamId ? 'free.dice-tipping.STREAM_TIP' : 'free.dice-tipping.TIP',
            tip.from,
            tip.to,
            tip.streamId ? tip.streamId : undefined,
            parseFloat(tip.amount)
          )
        ])
        .setMeta({
          chainId: KADENA_CONFIG.chainId,
          sender: tip.from,
          gasLimit: KADENA_CONFIG.gasLimit,
          gasPrice: KADENA_CONFIG.gasPrice,
          ttl: KADENA_CONFIG.ttl
        })
        .setNetworkId(KADENA_CONFIG.networkId)
        .createTransaction()

      // For browser-based transactions, we'd need the user to sign
      // This is a simplified example - in practice, you'd integrate with wallet
      const result = await kadenaClient.local(command)

      if (result.result.status === 'success') {
        // Submit the transaction
        const submitResult = await kadenaClient.submit(command)
        return submitResult.requestKey
      }

      throw new Error('Transaction simulation failed')

    } catch (error) {
      console.error('Failed to send tip:', error)
      return null
    }
  }

  // Get user statistics
  async getUserStats(account: string): Promise<any> {
    try {
      const command = Pact.builder
        .execution(`(free.dice-tipping.get-user-stats "${account}")`)
        .setMeta({
          chainId: KADENA_CONFIG.chainId,
          sender: account,
          gasLimit: 1000,
          gasPrice: KADENA_CONFIG.gasPrice,
          ttl: KADENA_CONFIG.ttl
        })
        .setNetworkId(KADENA_CONFIG.networkId)
        .createTransaction()

      const result = await kadenaClient.local(command)

      if (result.result.status === 'success') {
        return result.result.data
      }

      return null

    } catch (error) {
      console.error('Failed to get user stats:', error)
      return null
    }
  }

  // Get stream tips
  async getStreamTips(streamId: string): Promise<any[]> {
    try {
      const command = Pact.builder
        .execution(`(free.dice-tipping.get-stream-tips "${streamId}")`)
        .setMeta({
          chainId: KADENA_CONFIG.chainId,
          sender: 'dummy-account', // Read-only query
          gasLimit: 1000,
          gasPrice: KADENA_CONFIG.gasPrice,
          ttl: KADENA_CONFIG.ttl
        })
        .setNetworkId(KADENA_CONFIG.networkId)
        .createTransaction()

      const result = await kadenaClient.local(command)

      if (result.result.status === 'success') {
        return result.result.data
      }

      return []

    } catch (error) {
      console.error('Failed to get stream tips:', error)
      return []
    }
  }

  // Get recent tips
  async getRecentTips(limit: number = 10): Promise<any[]> {
    try {
      const command = Pact.builder
        .execution(`(free.dice-tipping.get-recent-tips ${limit})`)
        .setMeta({
          chainId: KADENA_CONFIG.chainId,
          sender: 'dummy-account', // Read-only query
          gasLimit: 1000,
          gasPrice: KADENA_CONFIG.gasPrice,
          ttl: KADENA_CONFIG.ttl
        })
        .setNetworkId(KADENA_CONFIG.networkId)
        .createTransaction()

      const result = await kadenaClient.local(command)

      if (result.result.status === 'success') {
        return result.result.data
      }

      return []

    } catch (error) {
      console.error('Failed to get recent tips:', error)
      return []
    }
  }

  // Check if contract is deployed
  async checkContractStatus(): Promise<boolean> {
    try {
      const command = Pact.builder
        .execution('(describe-module "free.dice-tipping")')
        .setMeta({
          chainId: KADENA_CONFIG.chainId,
          sender: 'dummy-account',
          gasLimit: 1000,
          gasPrice: KADENA_CONFIG.gasPrice,
          ttl: KADENA_CONFIG.ttl
        })
        .setNetworkId(KADENA_CONFIG.networkId)
        .createTransaction()

      const result = await kadenaClient.local(command)
      return result.result.status === 'success'

    } catch (error) {
      console.error('Failed to check contract status:', error)
      return false
    }
  }

  // Format Kadena address (k: format)
  formatKadenaAddress(publicKey: string): string {
    return `k:${publicKey}`
  }
}