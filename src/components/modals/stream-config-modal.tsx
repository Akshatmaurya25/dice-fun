"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWalletConnect } from "@/hooks/useWalletConnect"
import { supabase } from "@/lib/supabase"

interface StreamConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onStreamConfigured?: (config: StreamConfig) => void
}

export interface StreamConfig {
  title: string
  description: string
  thumbnail?: string
}

export function StreamConfigModal({ isOpen, onClose, onStreamConfigured }: StreamConfigModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { address, formatAddress } = useWalletConnect()

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Stream title is required")
      return
    }

    if (!address) {
      setError("Wallet not connected")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Create stream record in Supabase
      const streamData = {
        title: title.trim(),
        description: description.trim(),
        streamer_address: address,
        streamer_name: formatAddress(address),
        is_live: false,
        viewer_count: 0
      }

      const { data, error: supabaseError } = await supabase
        .from('streams')
        .insert(streamData)
        .select()
        .single()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        setError('Failed to create stream configuration')
        return
      }

      const config: StreamConfig = {
        title: title.trim(),
        description: description.trim()
      }

      onStreamConfigured?.(config)

      // Reset form
      setTitle("")
      setDescription("")
      onClose()

    } catch (err) {
      console.error('Stream configuration error:', err)
      setError('Failed to configure stream')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Configure Your Stream
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {address && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Badge variant="outline" className="font-mono">
                {formatAddress(address)}
              </Badge>
              <span className="text-sm text-muted-foreground">Streaming as</span>
            </div>
          )}

          <div>
            <label htmlFor="stream-title" className="text-sm font-medium mb-2 block">
              Stream Title *
            </label>
            <Input
              id="stream-title"
              type="text"
              placeholder="Enter your stream title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {title.length}/100 characters
            </div>
          </div>

          <div>
            <label htmlFor="stream-description" className="text-sm font-medium mb-2 block">
              Description (optional)
            </label>
            <Textarea
              id="stream-description"
              placeholder="Describe what you'll be streaming about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {description.length}/500 characters
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-muted-foreground">
              Thumbnail
            </label>
            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <div className="text-muted-foreground text-sm">
                📷 Thumbnail upload coming soon
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Currently disabled
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Configuring..." : "Start Stream"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Press Ctrl+Enter to quickly submit
          </p>
        </CardContent>
      </Card>
    </div>
  )
}