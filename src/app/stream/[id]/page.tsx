"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chat } from "@/components/stream/chat"
import { TipDialog } from "@/components/stream/tip-dialog"
import Link from "next/link"

// Mock stream data - in real app this would come from API
const getStreamData = (id: string) => {
  const streams = {
    "1": {
      id: "1",
      title: "Building DeFi Apps on Kadena",
      description: "In this stream, we'll walk through building a complete DeFi application on the Kadena blockchain. We'll cover smart contract development, frontend integration, and security best practices.",
      streamerName: "CryptoDev",
      streamerENS: "cryptodev.kda",
      streamerAddress: "0x1234...5678",
      viewerCount: 234,
      category: "Technology",
      isLive: true,
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      followers: 1250,
      totalEarnings: "45.6",
    },
    "2": {
      id: "2",
      title: "NFT Trading Strategies",
      description: "Learn advanced NFT trading strategies and market analysis techniques for maximizing profits in the NFT space.",
      streamerName: "TraderJoe",
      streamerENS: undefined,
      streamerAddress: "0xabcd...efgh",
      viewerCount: 156,
      category: "Finance",
      isLive: true,
      startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      followers: 890,
      totalEarnings: "23.4",
    },
  }
  return streams[id as keyof typeof streams] || streams["1"]
}

export default function StreamPage({ params }: { params: Promise<{ id: string }> }) {
  const [streamId, setStreamId] = React.useState<string>("")

  React.useEffect(() => {
    params.then((p) => setStreamId(p.id))
  }, [params])

  const stream = getStreamData(streamId)
  const [showTipDialog, setShowTipDialog] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const streamDuration = () => {
    const now = new Date()
    const started = stream.startedAt
    const diffMs = now.getTime() - started.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}:${minutes.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Video Player and Info */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            {/* Placeholder for video player */}
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-xl">Live Stream Player</p>
                <p className="text-sm opacity-75 mt-2">
                  Video streaming integration would go here
                </p>
              </div>
            </div>

            {/* Live indicator */}
            {stream.isLive && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 hover:bg-red-600">
                  🔴 LIVE
                </Badge>
              </div>
            )}

            {/* Viewer count */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {stream.viewerCount} watching
              </Badge>
            </div>

            {/* Stream duration */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {streamDuration()}
              </Badge>
            </div>
          </div>

          {/* Stream Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
              <p className="text-muted-foreground">{stream.description}</p>
            </div>

            {/* Streamer Info */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {stream.streamerName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {stream.streamerENS || stream.streamerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stream.followers} followers
                  </p>
                </div>
                <Badge variant="outline">{stream.category}</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={isFollowing ? "bg-primary text-primary-foreground" : ""}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button onClick={() => setShowTipDialog(true)}>
                  💰 Tip
                </Button>
              </div>
            </div>
          </div>

          {/* Stream Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stream Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stream.viewerCount}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Viewers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stream.followers}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {streamDuration()}
                  </div>
                  <div className="text-sm text-muted-foreground">Stream Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stream.totalEarnings} MATIC
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tips</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat */}
        <div className="lg:col-span-1">
          <Chat streamId={stream.id} streamerName={stream.streamerName} />
        </div>
      </div>

      {/* Related Streams */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More Streams in {stream.category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Placeholder for related streams */}
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-3 flex items-center justify-center">
                  <span className="text-2xl">📺</span>
                </div>
                <h4 className="font-medium text-sm mb-1">Related Stream {i}</h4>
                <p className="text-xs text-muted-foreground">Creator Name</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {Math.floor(Math.random() * 100)} watching
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/browse">
            <Button variant="outline">Browse All Streams</Button>
          </Link>
        </div>
      </div>

      {/* Tip Dialog */}
      <TipDialog
        streamer={{
          name: stream.streamerName,
          ensName: stream.streamerENS,
          address: stream.streamerAddress,
        }}
        isOpen={showTipDialog}
        onClose={() => setShowTipDialog(false)}
      />
    </div>
  )
}