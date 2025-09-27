"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ServerStats {
  activeStreams: number
  totalViewers: number
  uptime: number
}

interface ServerStatusProps {
  onServerStatusChange?: (isOnline: boolean) => void
}

export function ServerStatus({ onServerStatusChange }: ServerStatusProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [stats, setStats] = useState<ServerStats | null>(null)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:9000/health', {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (response.ok) {
        setIsOnline(true)
        onServerStatusChange?.(true)

        // Get stats
        const statsResponse = await fetch('http://localhost:9000/api/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } else {
        setIsOnline(false)
        onServerStatusChange?.(false)
      }
    } catch (error) {
      setIsOnline(false)
      onServerStatusChange?.(false)
      console.warn('Streaming server not available:', error)
    }

    setLastCheck(new Date())
  }

  useEffect(() => {
    checkServerStatus()
    const interval = setInterval(checkServerStatus, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Streaming Server
          <Badge
            className={isOnline ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isOnline && stats ? (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats.activeStreams}
              </div>
              <div className="text-sm text-muted-foreground">Active Streams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {stats.totalViewers}
              </div>
              <div className="text-sm text-muted-foreground">Total Viewers</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {isOnline ? "Loading stats..." : "Server unavailable"}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Last checked: {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
          {isOnline && stats && (
            <div>Server uptime: {formatUptime(stats.uptime)}</div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={checkServerStatus}
          className="w-full"
        >
          🔄 Refresh Status
        </Button>

        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <div className="font-medium text-yellow-800">Server Setup Required</div>
            <div className="text-yellow-700 mt-1">
              To start streaming, run the streaming server:
            </div>
            <div className="font-mono text-xs bg-yellow-100 p-2 rounded mt-2">
              cd streaming-server && npm start
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}