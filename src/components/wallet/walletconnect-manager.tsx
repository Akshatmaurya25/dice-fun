"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWalletConnect } from "@/hooks/useWalletConnect"

export function WalletConnectManager() {
  const {
    isReady,
    isLoading,
    sessions,
    pairWithDapp,
  } = useWalletConnect()

  const [pairingUri, setPairingUri] = useState("")
  const [isPairing, setIsPairing] = useState(false)

  const handlePair = async () => {
    if (!pairingUri.trim()) {
      alert("Please enter a WalletConnect URI")
      return
    }

    setIsPairing(true)
    try {
      await pairWithDapp(pairingUri)
      setPairingUri("")
    } catch (error) {
      console.error("Pairing failed:", error)
      alert("Failed to connect to dApp. Please check the URI and try again.")
    } finally {
      setIsPairing(false)
    }
  }

  const formatDAppName = (session: any) => {
    return session.peer?.metadata?.name || "Unknown dApp"
  }

  const formatDAppUrl = (session: any) => {
    return session.peer?.metadata?.url || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          WalletConnect
          <div className="flex items-center gap-2">
            {isLoading && (
              <Badge variant="secondary" className="text-xs">
                Initializing...
              </Badge>
            )}
            {isReady && (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                Ready
              </Badge>
            )}
            {sessions.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {sessions.length} connected
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isReady ? (
          <div className="text-center py-4">
            <div className="text-muted-foreground text-sm">
              {isLoading ? "Initializing WalletConnect..." : "Connect your wallet to use WalletConnect"}
            </div>
          </div>
        ) : (
          <>
            {/* Pairing Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Connect to dApp</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter WalletConnect URI (wc:...)"
                  value={pairingUri}
                  onChange={(e) => setPairingUri(e.target.value)}
                  className="font-mono text-xs"
                />
                <Button
                  onClick={handlePair}
                  disabled={isPairing || !pairingUri.trim()}
                  size="sm"
                >
                  {isPairing ? "Connecting..." : "Connect"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Scan a QR code or paste the WalletConnect URI from a dApp
              </p>
            </div>

            {/* Active Sessions */}
            {sessions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Connected dApps</h4>
                </div>

                <div className="space-y-2">
                  {sessions.map((session: any, index: number) => (
                    <div
                      key={session.topic || index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {formatDAppName(session)}
                        </div>
                        {formatDAppUrl(session) && (
                          <div className="text-xs text-muted-foreground truncate">
                            {formatDAppUrl(session)}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Connected
                          </Badge>
                          {session.namespaces?.eip155 && (
                            <Badge variant="secondary" className="text-xs">
                              Polygon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-2xl mb-2">🔗</div>
                <div className="text-sm">No connected dApps</div>
                <div className="text-xs mt-1">
                  Connect to dApps using WalletConnect to manage them here
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">How to use:</div>
                <ul className="space-y-1">
                  <li>• Visit any dApp that supports WalletConnect</li>
                  <li>• Click "Connect Wallet" and select WalletConnect</li>
                  <li>• Copy the URI or scan the QR code</li>
                  <li>• Paste it above and click Connect</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}