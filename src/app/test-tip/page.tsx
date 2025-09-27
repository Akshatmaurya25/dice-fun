"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TipDialog } from "@/components/stream/tip-dialog"
import { useDiceTipping } from "@/hooks/useDiceTipping"

const TEST_ADDRESS = "0x0B4C5faEAF50AdE33B6F8d4b4D5fFA63D1149B11"

export default function TestTipPage() {
  const [showTipDialog, setShowTipDialog] = useState(false)
  const [testAmount, setTestAmount] = useState("0.01")
  const [testMessage, setTestMessage] = useState("Test tip from the test page!")
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const { sendTip, sendStreamTip, isLoading, error, connectWallet, isConnected, account } = useDiceTipping()

  // Check connection status on mount
  useEffect(() => {
    if (isConnected && account) {
      setWalletAddress(account)
    }
  }, [isConnected, account])

  const formatAddress = (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleQuickTip = async () => {
    if (!testAmount || isNaN(Number(testAmount))) {
      alert("Please enter a valid amount")
      return
    }

    try {
      const tx = await sendTip(TEST_ADDRESS, testMessage || "Quick test tip", testAmount)
      if (tx) {
        setLastTxHash(tx.hash)
        alert(`Tip sent successfully! TX: ${tx.hash}`)
      }
    } catch (error) {
      console.error("Quick tip failed:", error)
    }
  }

  const handleStreamTip = async () => {
    if (!testAmount || isNaN(Number(testAmount))) {
      alert("Please enter a valid amount")
      return
    }

    try {
      const tx = await sendStreamTip(TEST_ADDRESS, "test-stream-123", testMessage || "Test stream tip", testAmount)
      if (tx) {
        setLastTxHash(tx.hash)
        alert(`Stream tip sent successfully! TX: ${tx.hash}`)
      }
    } catch (error) {
      console.error("Stream tip failed:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🧪 Tip Testing Page</h1>
          <p className="text-muted-foreground">
            Test the tipping functionality with a constant address
          </p>
        </div>

        {/* Test Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Test Recipient Address</label>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                {TEST_ADDRESS}
              </div>
            </div>

            {walletAddress && (
              <div>
                <label className="text-sm font-medium mb-1 block">Your Wallet Address</label>
                <Badge variant="outline" className="font-mono">
                  {formatAddress(walletAddress)}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Card */}
        {!isConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your wallet to test the tipping functionality
              </p>
              <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Test Controls */}
        {isConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Tip Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (KDA)</label>
                <Input
                  type="number"
                  placeholder="0.01"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Input
                  type="text"
                  placeholder="Test message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  maxLength={200}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleQuickTip}
                disabled={isLoading || !testAmount}
                className="flex-1"
              >
                {isLoading ? "Sending..." : "🚀 Send Regular Tip"}
              </Button>
              <Button
                onClick={handleStreamTip}
                disabled={isLoading || !testAmount}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? "Sending..." : "📺 Send Stream Tip"}
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                Error: {error}
              </div>
            )}

            {lastTxHash && (
              <div className="text-green-600 text-sm p-2 bg-green-50 rounded">
                <div className="font-medium">✅ Last transaction successful!</div>
                <div className="font-mono text-xs mt-1 break-all">
                  {lastTxHash}
                </div>
                <a
                  href={`https://explorer.kadena.io/tx/${lastTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </CardContent>
        </Card>

          </Card>
        )}

        {/* Modal Test */}
        {isConnected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Modal Tip Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Test the tip dialog modal with the same recipient address
              </p>
              <Button onClick={() => setShowTipDialog(true)}>
                🎯 Open Tip Dialog
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Preset Amount Tests */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Preset Amount Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["0.001", "0.01", "0.1", "1"].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => {
                      setTestAmount(amount)
                      handleQuickTip()
                    }}
                    disabled={isLoading}
                    size="sm"
                  >
                    Tip {amount} KDA
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tip Dialog */}
        <TipDialog
          streamer={{
            name: "Test Recipient",
            address: TEST_ADDRESS,
          }}
          streamId="test-stream-123"
          isOpen={showTipDialog}
          onClose={() => setShowTipDialog(false)}
        />
      </div>
    )
}