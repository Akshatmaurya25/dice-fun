"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const handleTip = async () => {
    if (!amount || isNaN(Number(amount))) return

    setLoading(true)
    // Placeholder for tip functionality
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    onClose()
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

          <Button
            onClick={handleTip}
            disabled={!amount || loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send Tip"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Tips are sent directly to the streamer&apos;s wallet using Polygon network.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}