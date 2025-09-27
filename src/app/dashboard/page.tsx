"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
// Unused tabs imports removed as tabs are not used in this dashboard

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
  const [isStreaming, setIsStreaming] = useState(creatorData.currentStream.isLive)
  const [streamTitle, setStreamTitle] = useState(creatorData.currentStream.title)

  const handleStartStream = () => {
    setIsStreaming(true)
  }

  const handleStopStream = () => {
    setIsStreaming(false)
  }

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
                {isStreaming && (
                  <Badge className="bg-red-500 hover:bg-red-600">🔴 LIVE</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isStreaming ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Currently Streaming</h3>
                    <p className="text-lg">{streamTitle}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {creatorData.currentStream.viewers}
                      </div>
                      <div className="text-sm text-muted-foreground">Viewers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {creatorData.currentStream.duration}
                      </div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {creatorData.currentStream.earnings} MATIC
                      </div>
                      <div className="text-sm text-muted-foreground">Tips</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleStopStream}
                    variant="destructive"
                    className="w-full"
                  >
                    Stop Stream
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Stream Title
                    </label>
                    <input
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      placeholder="Enter stream title..."
                    />
                  </div>
                  <Button
                    onClick={handleStartStream}
                    className="w-full"
                    size="lg"
                  >
                    🎬 Start Streaming
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