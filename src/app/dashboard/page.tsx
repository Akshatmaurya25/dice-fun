"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/useWallet"
import { useStreaming } from "@/hooks/useStreaming"
import { Input } from "@/components/ui/input"
import { ServerStatus } from "@/components/stream/server-status"
import { LiveStreams } from "@/components/stream/live-streams"

// Mock creator data
const creatorData = {
  name: "CryptoDev",
  ensName: "cryptodev.kda",
  address: "0x1234...5678",
  isVerified: true,
  selfProtocolStatus: "verified", // verified, pending, not-started
  followers: 1250,
  totalStreams: 45,
  totalEarnings: "234.56",
  monthlyEarnings: "45.23",
  currentStream: {
    id: "1",
    title: "Building DeFi Apps on Kadena",
    isLive: true,
    viewers: 234,
    duration: "1:23:45",
    earnings: "12.34",
  },
  recentStreams: [
    {
      id: "2",
      title: "Smart Contract Security Review",
      date: "2024-01-26",
      viewers: 189,
      duration: "2:15:30",
      earnings: "8.90",
    },
    {
      id: "3",
      title: "Kadena Ecosystem Updates",
      date: "2024-01-25",
      viewers: 445,
      duration: "1:45:20",
      earnings: "15.67",
    },
    {
      id: "4",
      title: "DeFi Protocol Analysis",
      date: "2024-01-24",
      viewers: 298,
      duration: "3:02:15",
      earnings: "22.45",
    },
  ],
}

const earningsData = [
  { date: "Jan 20", amount: 8.5 },
  { date: "Jan 21", amount: 12.3 },
  { date: "Jan 22", amount: 15.8 },
  { date: "Jan 23", amount: 9.2 },
  { date: "Jan 24", amount: 22.4 },
  { date: "Jan 25", amount: 15.7 },
  { date: "Jan 26", amount: 8.9 },
]

export default function DashboardPage() {
  const [streamTitle, setStreamTitle] = useState("Building DeFi Apps on Kadena")
  const [streamCategory, setStreamCategory] = useState("Technology")
  const [showRTMPInfo, setShowRTMPInfo] = useState(false)
  const [rtmpCredentials, setRtmpCredentials] = useState<{ rtmpUrl: string; streamKey: string } | null>(null)
  const [serverOnline, setServerOnline] = useState(false)

  const { isConnected, connectWallet, address, formatAddress } = useWallet()
  const {
    isStreaming,
    isLive,
    viewers,
    duration,
    startTime,
    isStarting,
    isStopping,
    startStream,
    stopStream,
    updateStreamInfo,
    getStreamStats
  } = useStreaming()

  const handleStartStream = async () => {
    if (!serverOnline) {
      alert("Streaming server is offline. Please start the streaming server first.")
      return
    }

    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!streamTitle.trim()) {
      alert("Please enter a stream title")
      return
    }

    const credentials = await startStream(streamTitle, streamCategory)
    if (credentials) {
      setRtmpCredentials(credentials)
      setShowRTMPInfo(true)
    }
  }

  const handleStopStream = async () => {
    const success = await stopStream()
    if (success) {
      setShowRTMPInfo(false)
      setRtmpCredentials(null)
    }
  }

  const handleUpdateStreamInfo = () => {
    updateStreamInfo(streamTitle, streamCategory)
  }

  const streamStats = getStreamStats()

  const getSelfProtocolStatusBadge = () => {
    switch (creatorData.selfProtocolStatus) {
      case "verified":
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">⏳ Pending</Badge>
      case "not-started":
        return <Badge variant="outline">Start Verification</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your streams, track earnings, and grow your audience
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{creatorData.followers}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Streams</p>
                <p className="text-2xl font-bold">{creatorData.totalStreams}</p>
              </div>
              <div className="text-3xl">📺</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">{creatorData.totalEarnings} MATIC</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="text-2xl font-bold">{creatorData.monthlyEarnings} MATIC</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Stream Control
                <div className="flex items-center space-x-2">
                  {isStreaming && (
                    <Badge className="bg-yellow-500">🔄 Streaming</Badge>
                  )}
                  {isLive && (
                    <Badge className="bg-red-500 hover:bg-red-600">🔴 LIVE</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Connect your wallet to start streaming</p>
                  <Button onClick={connectWallet} className="w-full">
                    Connect Wallet
                  </Button>
                </div>
              ) : isStreaming ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Currently Streaming</h3>
                    <p className="text-lg">{streamTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {isLive ? "Live" : "Connecting..."}
                    </p>
                  </div>

                  {/* RTMP Information */}
                  {showRTMPInfo && rtmpCredentials && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-sm">RTMP Settings</h4>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Server:</span>
                          <div className="font-mono bg-background p-1 rounded mt-1 break-all">
                            {rtmpCredentials.rtmpUrl}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Stream Key:</span>
                          <div className="font-mono bg-background p-1 rounded mt-1 break-all">
                            {rtmpCredentials.streamKey}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`Server: ${rtmpCredentials.rtmpUrl}\nStream Key: ${rtmpCredentials.streamKey}`)
                          alert("RTMP settings copied to clipboard!")
                        }}
                      >
                        Copy Settings
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {viewers}
                      </div>
                      <div className="text-sm text-muted-foreground">Viewers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {duration}
                      </div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {streamStats.bitrate}
                      </div>
                      <div className="text-sm text-muted-foreground">Bitrate</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleStopStream}
                    variant="destructive"
                    className="w-full"
                    disabled={isStopping}
                  >
                    {isStopping ? "Stopping..." : "Stop Stream"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Stream Title
                    </label>
                    <Input
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="Enter stream title..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <select
                      value={streamCategory}
                      onChange={(e) => setStreamCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Art">Art</option>
                      <option value="Music">Music</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleStartStream}
                    className="w-full"
                    size="lg"
                    disabled={isStarting || !serverOnline}
                    variant={!serverOnline ? "secondary" : "default"}
                  >
                    {isStarting ? "Starting..." : !serverOnline ? "⚠️ Server Offline" : "🎬 Start Streaming"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Weekly Goal Progress</span>
                  <span className="text-sm text-muted-foreground">45.23 / 60.00 MATIC</span>
                </div>
                <Progress value={75} className="h-2" />

                <div className="grid grid-cols-7 gap-2 mt-6">
                  {earningsData.map((day, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="bg-primary/20 rounded-sm mb-1"
                        style={{
                          height: `${Math.max(day.amount * 3, 8)}px`,
                          backgroundColor: `hsl(var(--primary) / ${day.amount / 25})`
                        }}
                      />
                      <div className="text-xs text-muted-foreground">{day.date.slice(4)}</div>
                      <div className="text-xs font-medium">${day.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Streams */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creatorData.recentStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{stream.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stream.date} • {stream.viewers} viewers • {stream.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{stream.earnings} MATIC</div>
                      <Button variant="outline" size="sm" className="mt-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Server Status */}
          <ServerStatus onServerStatusChange={setServerOnline} />

          {/* Live Streams */}
          <LiveStreams />

          {/* Profile Status */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">ENS Name</span>
                <Badge variant="outline">{creatorData.ensName}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Self Protocol</span>
                {getSelfProtocolStatusBadge()}
              </div>

              {creatorData.selfProtocolStatus !== "verified" && (
                <Button variant="outline" className="w-full">
                  {creatorData.selfProtocolStatus === "pending" ? "Check Status" : "Start Verification"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Wallet Info */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet & Earnings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {creatorData.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-primary">
                  {creatorData.monthlyEarnings} MATIC
                </p>
              </div>

              <Button className="w-full">
                💸 Withdraw Earnings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                ⚙️ Stream Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📊 View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🎯 Set Goals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📱 Mobile App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}