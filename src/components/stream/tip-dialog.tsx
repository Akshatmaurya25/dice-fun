"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrivyWallet } from "@/hooks/usePrivyWallet"

interface TipDialogProps {
  streamer: {
    name: string
    ensName?: string
    address: string
  }
  isOpen: boolean
  onClose: () => void
}

export function TipDialog({ streamer, isOpen, onClose }: TipDialogProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const { isConnected, sendTip, switchToPolygon, connectWallet } = usePrivyWallet()

  const handleTip = async () => {
    if (!amount || isNaN(Number(amount))) return

    if (!isConnected) {
      await connectWallet()
      return
    }

    // Privy handles network switching automatically

    setLoading(true)
    setTxHash(null)

    try {
      const hash = await sendTip(streamer.address, amount)
      if (hash) {
        setTxHash(hash)
        setAmount("")
        // Show success state for 3 seconds then close
        setTimeout(() => {
          onClose()
          setTxHash(null)
        }, 3000)
      } else {
        alert("Transaction failed. Please try again.")
      }
    } catch (error) {
      console.error("Tip failed:", error)
      alert("Transaction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Support {streamer.ensName || streamer.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="tip-amount" className="text-sm font-medium mb-2 block">
              Tip Amount (MATIC)
            </label>
            <input
              id="tip-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("0.1")}
            >
              0.1 MATIC
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("0.5")}
            >
              0.5 MATIC
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("1")}
            >
              1 MATIC
            </Button>
          </div>

          {txHash ? (
            <div className="text-center space-y-2">
              <div className="text-green-600 font-medium">✅ Tip Sent Successfully!</div>
              <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                {txHash}
              </div>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs"
              >
                View on PolygonScan →
              </a>
            </div>
          ) : (
            <>
              <Button
                onClick={handleTip}
                disabled={!amount || loading}
                className="w-full"
              >
                {loading
                  ? "Processing..."
                  : !isConnected
                  ? "Connect Wallet"
                  : "Send Tip"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {!isConnected
                  ? "Connect your wallet to send tips via email, social login, or external wallet"
                  : "Tips are sent directly to the streamer's wallet using Polygon network."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}