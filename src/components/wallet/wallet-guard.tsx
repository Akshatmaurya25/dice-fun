"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWalletConnect } from "@/hooks/useWalletConnect"

interface WalletGuardProps {
  children: ReactNode
  requireConnection?: boolean
  fallbackMessage?: string
}

export function WalletGuard({
  children,
  requireConnection = true,
  fallbackMessage = "Please connect your wallet to continue"
}: WalletGuardProps) {
  const { isConnected, isLoading, connectWallet } = useWalletConnect()

  if (!requireConnection) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking wallet connection...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">🔐 Wallet Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{fallbackMessage}</p>
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}