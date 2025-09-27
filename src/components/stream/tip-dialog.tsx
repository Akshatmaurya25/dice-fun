"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDiceTipping } from "@/hooks/useDiceTipping"
import { KADENA_EVM_NETWORKS } from "@/config/contracts"

interface TipDialogProps {
  streamer: {
    name: string
    address: string
  }
  streamId?: string
  isOpen: boolean
  onClose: () => void
}

export function TipDialog({ streamer, streamId, isOpen, onClose }: TipDialogProps) {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const {
    isConnected,
    isLoading,
    error,
    connectWallet,
    sendTip,
    sendStreamTip
  } = useDiceTipping()

  const handleTip = async () => {
    if (!amount || isNaN(Number(amount))) return

    if (!isConnected) {
      await connectWallet()
      return
    }

    setTxHash(null)

    try {
      let tx
      if (streamId) {
        // Send stream tip if streamId is provided
        tx = await sendStreamTip(streamer.address, streamId, message || "Thanks for the great stream!", amount)
      } else {
        // Send regular tip
        tx = await sendTip(streamer.address, message || "Thanks for being awesome!", amount)
      }

      if (tx) {
        setTxHash(tx.hash)
        setAmount("")
        setMessage("")
        // Show success state for 5 seconds then close
        setTimeout(() => {
          onClose()
          setTxHash(null)
        }, 5000)
      }
    } catch (error) {
      console.error("Tip failed:", error)
      // Error handling is done in the hook
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Support {streamer.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="tip-amount" className="text-sm font-medium mb-2 block">
              Tip Amount (KDA)
            </label>
            <input
              id="tip-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              min="0.001"
              step="0.001"
            />
          </div>

          <div>
            <label htmlFor="tip-message" className="text-sm font-medium mb-2 block">
              Message (optional)
            </label>
            <input
              id="tip-message"
              type="text"
              placeholder="Thanks for the great content!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              maxLength={200}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("0.01")}
            >
              0.01 KDA
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("0.1")}
            >
              0.1 KDA
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount("1")}
            >
              1 KDA
            </Button>
          </div>

          {txHash ? (
            <div className="text-center space-y-2">
              <div className="text-green-600 font-medium">✅ Tip Sent Successfully!</div>
              <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                {txHash}
              </div>
              <a
                href={`${KADENA_EVM_NETWORKS.testnet.blockExplorer}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs"
              >
                View on Kadena Explorer →
              </a>
            </div>
          ) : (
            <>
              <Button
                onClick={handleTip}
                disabled={!amount || isLoading}
                className="w-full"
              >
                {isLoading
                  ? "Processing..."
                  : !isConnected
                  ? "Connect Wallet"
                  : streamId
                  ? "Send Stream Tip"
                  : "Send Tip"}
              </Button>

              {error && (
                <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                {!isConnected
                  ? "Connect your wallet to send tips on Kadena EVM network"
                  : streamId
                  ? "Stream tips are recorded on-chain and sent directly to the streamer via Kadena EVM."
                  : "Tips are sent directly to the recipient's wallet via Kadena EVM smart contract."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}