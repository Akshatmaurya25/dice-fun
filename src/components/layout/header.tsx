"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePrivyWallet } from "@/hooks/usePrivyWallet"
import { useWalletConnect } from "@/hooks/useWalletConnect"

export function Header() {
  const {
    isConnected,
    address,
    isLoading,
    connectWallet,
    disconnectWallet,
    formatAddress,
    switchToPolygon,
    user,
    userEmail,
    authMethod,
    hasEmbeddedWallet,
    walletCount
  } = usePrivyWallet()

  const { isInitialized: wcInitialized, sessionCount } = useWalletConnect()

  const handleWalletAction = async () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      await connectWallet()
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-foreground">KadeLive</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/browse"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          {isConnected && (
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Wallet Connection */}
          <div className="flex items-center space-x-2">
            {isConnected && (
              <div className="flex items-center space-x-2">
                {userEmail && (
                  <Badge variant="secondary" className="text-xs">
                    {userEmail}
                  </Badge>
                )}
                {hasEmbeddedWallet && (
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                    🔐 Smart Wallet
                  </Badge>
                )}
                {address && (
                  <Badge variant="outline" className="font-mono">
                    {formatAddress(address)}
                  </Badge>
                )}
                {walletCount > 1 && (
                  <Badge variant="secondary" className="text-xs">
                    {walletCount} wallets
                  </Badge>
                )}
                {wcInitialized && sessionCount > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                    🔗 {sessionCount} dApp{sessionCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant={isConnected ? "outline" : "default"}
              size="sm"
              onClick={handleWalletAction}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          {/* Streaming Action */}
          <Link href="/dashboard">
            <Button size="sm">
              {isConnected ? "Start Streaming" : "Dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}