"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/useWallet"

export function Header() {
  const {
    isConnected,
    address,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isPolygon,
    switchToPolygon
  } = useWallet()

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
                {!isPolygon && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={switchToPolygon}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    Switch to Polygon
                  </Button>
                )}
                <Badge variant="outline" className="font-mono">
                  {formatAddress(address!)}
                </Badge>
              </div>
            )}
            <Button
              variant={isConnected ? "outline" : "default"}
              size="sm"
              onClick={handleWalletAction}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect Wallet"}
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