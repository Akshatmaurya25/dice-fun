"use client"

import { useWalletConnect } from "@/hooks/useWalletConnect"
import { useStreaming } from "@/hooks/useStreaming"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WalletTest() {
  const {
    isConnected,
    isLoading,
    isReady,
    address,
    connectWallet,
    sendTip,
    formatAddress
  } = useWalletConnect()

  const {
    isStreaming,
    isLive,
    startStream,
    stopStream,
    getCurrentStreamId
  } = useStreaming()

  const handleTestTip = async () => {
    if (!isConnected || !address) {
      alert("Please connect wallet first")
      return
    }

    const streamId = getCurrentStreamId()
    if (streamId) {
      const txHash = await sendTip(address, "0.001", streamId, "Test tip!")
      if (txHash) {
        alert(`Tip sent! Transaction hash: ${txHash}`)
      } else {
        alert("Tip failed")
      }
    } else {
      alert("No active stream to tip")
    }
  }

  const handleTestStream = async () => {
    if (!isConnected) {
      alert("Please connect wallet first")
      return
    }

    if (isStreaming) {
      await stopStream()
    } else {
      await startStream("Test Stream", "Technology", address || undefined)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet & Streaming Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Status:</p>
          <p className="font-medium">
            {isLoading ? "Loading..." :
             isReady ? (isConnected ? `Connected: ${formatAddress(address || "")}` : "Not Connected") :
             "Not Ready"}
          </p>
        </div>

        {!isConnected ? (
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-2">
            <Button onClick={handleTestStream} className="w-full">
              {isStreaming ? "Stop Stream" : "Start Test Stream"}
            </Button>
            <Button onClick={handleTestTip} variant="outline" className="w-full">
              Send Test Tip (0.001 MATIC)
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Stream Status: {isStreaming ? (isLive ? "🔴 Live" : "🟡 Starting...") : "⚪ Offline"}</p>
          {getCurrentStreamId() && <p>Stream ID: {getCurrentStreamId()?.slice(0, 8)}...</p>}
        </div>
      </CardContent>
    </Card>
  )
}