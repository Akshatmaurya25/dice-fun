"use client"

// This hook now uses the MetaMask adapter for direct MetaMask connection
import { useMetaMask } from './useMetaMask'

export function useWalletConnect() {
  const metaMask = useMetaMask()

  // Add dummy sendTip and pairWithDapp methods for compatibility
  const sendTip = async (toAddress: string, amount: string, streamId?: string, message?: string): Promise<string | null> => {
    console.log('Tip functionality not implemented in MetaMask adapter')
    return null
  }

  const pairWithDapp = async (uri: string): Promise<boolean> => {
    console.log('WalletConnect pairing not needed with MetaMask adapter')
    return false
  }

  return {
    ...metaMask,
    sendTip,
    pairWithDapp,
  }
}