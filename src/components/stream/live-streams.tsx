"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LiveStream {
  streamKey: string
  title?: string
  category?: string
  streamerId?: string
  isActive: boolean
  startTime?: string
  viewUrl: string
  hlsUrl: string
  connectionId?: string
  appName?: string
}

export function LiveStreams() {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStreams = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/streams/live', {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch streams')
      }

      const data = await response.json()
      setStreams(data.streams || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streams')
      console.error('Failed to fetch streams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()

    // Refresh streams every 30 seconds
    const interval = setInterval(fetchStreams, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (startedAt?: string) => {
    if (!startedAt) return 'Just started'

    const start = new Date(startedAt)
    const now = new Date()
    const diff = now.getTime() - start.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleWatch = (stream: LiveStream) => {
    // Navigate to stream viewer page
    window.location.href = stream.viewUrl
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Failed to load streams</div>
            <Button onClick={fetchStreams} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          Live Streams
          <Badge variant="secondary" className="text-xs">
            {streams.length} active
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {streams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-lg mb-2">🎥</div>
            <div>No live streams at the moment</div>
            <div className="text-sm mt-1">Check back later or start your own stream!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {streams.map((stream) => (
              <div key={stream.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{stream.title || `Stream ${stream.streamKey.slice(-8)}`}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Stream Key: {stream.streamKey}</span>
                      {stream.category && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {stream.category}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stream.isActive && (
                      <Badge className="bg-red-500 hover:bg-red-600">
                        🔴 LIVE
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>🔗</span>
                      <span className="font-mono text-xs">{stream.connectionId || 'Active'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{formatDuration(stream.startTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleWatch(stream)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      📺 Watch Live
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={fetchStreams}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}