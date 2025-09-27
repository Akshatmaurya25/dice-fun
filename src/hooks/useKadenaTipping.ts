"use client"

import { useState, useCallback } from 'react'
import { KadenaService, TipRecord } from '@/lib/kadena-client'

export interface KadenaTip {
  from: string
  to: string
  amount: string
  streamId?: string
  message?: string
}

export function useKadenaTipping() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastTipResult, setLastTipResult] = useState<string | null>(null)

  const kadenaService = KadenaService.getInstance()

  const sendKadenaTip = useCallback(async (tip: KadenaTip): Promise<boolean> => {
    try {
      setIsLoading(true)
      setLastTipResult(null)

      const result = await kadenaService.sendTip(tip)

      if (result) {
        setLastTipResult(result)
        return true
      }

      return false
    } catch (error) {
      console.error('Failed to send Kadena tip:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [kadenaService])

  const getUserStats = useCallback(async (account: string) => {
    try {
      return await kadenaService.getUserStats(account)
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return null
    }
  }, [kadenaService])

  const getStreamTips = useCallback(async (streamId: string) => {
    try {
      return await kadenaService.getStreamTips(streamId)
    } catch (error) {
      console.error('Failed to get stream tips:', error)
      return []
    }
  }, [kadenaService])

  const getRecentTips = useCallback(async (limit: number = 10) => {
    try {
      return await kadenaService.getRecentTips(limit)
    } catch (error) {
      console.error('Failed to get recent tips:', error)
      return []
    }
  }, [kadenaService])

  const checkContractStatus = useCallback(async () => {
    try {
      return await kadenaService.checkContractStatus()
    } catch (error) {
      console.error('Failed to check contract status:', error)
      return false
    }
  }, [kadenaService])

  return {
    // State
    isLoading,
    lastTipResult,

    // Actions
    sendKadenaTip,
    getUserStats,
    getStreamTips,
    getRecentTips,
    checkContractStatus,

    // Utils
    formatKadenaAddress: kadenaService.formatKadenaAddress,
  }
}