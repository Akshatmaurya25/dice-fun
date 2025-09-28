"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWalletConnect } from "@/hooks/useWalletConnect"
import { useStreaming } from "@/hooks/useStreaming"

export function Header() {
  const {
    isConnected,
    isLoading,
    address,
    sessions,
    connectWallet,
    disconnectWallet,
    formatAddress,
    userEmail,
    hasEmbeddedWallet,
    walletCount
  } = useWalletConnect()

  const { isStreaming, getCurrentStreamId } = useStreaming()

  const handleWalletAction = async () => {
    if (isConnected) {
      await disconnectWallet()
    } else {
      await connectWallet()
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="dice.fun"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-foreground">dice.fun</span>
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
          <Link
            href="/verify"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
          >
            <span className="mr-1">🛡️</span>
            Verify Identity
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
                {sessions?.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                    🔗 {sessions.length} dApp{sessions.length !== 1 ? 's' : ''}
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
          {isStreaming ? (
            <Button
              size="sm"
              onClick={() => {
                const streamId = getCurrentStreamId()
                if (streamId) {
                  window.open(`/stream/${streamId}`, '_blank')
                }
              }}
              className="bg-red-600 hover:bg-red-700 animate-pulse"
            >
              🔴 View Live Stream
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button size="sm">
                {isConnected ? "Start Streaming" : "Dashboard"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}