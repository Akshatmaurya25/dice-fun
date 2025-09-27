"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chat } from "@/components/stream/chat"
import { TipDialog } from "@/components/stream/tip-dialog"
import { HLSVideoPlayer } from "@/components/stream/hls-video-player"
import Link from "next/link"

function ViewerCount({ viewerCount }: { viewerCount: number }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000) // Hide after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute top-4 right-4 transition-opacity duration-500">
      <Badge variant="secondary" className="bg-black/60 text-white">
        {viewerCount} watching
      </Badge>
    </div>
  )
}

// Dynamic stream data - accepts any stream key
const getStreamData = (streamKey: string) => {
  // In a real app, this would fetch from API using the stream key
  // For now, return dynamic data based on the stream key
  return {
    id: streamKey,
    streamKey: streamKey,
    title: `Live Stream - ${streamKey}`,
    description: "Live streaming session in progress. Join the conversation!",
    streamerName: "LiveStreamer",
    streamerENS: undefined,
    streamerAddress: "0x1234...5678",
    viewerCount: Math.floor(Math.random() * 100) + 50,
    category: "Technology",
    isLive: true,
    startedAt: new Date(Date.now() - Math.random() * 3600000), // Random start time within last hour
    followers: Math.floor(Math.random() * 1000) + 500,
    totalEarnings: (Math.random() * 50).toFixed(1),
  }
}

export default function StreamPage({ params }: { params: Promise<{ id: string }> }) {
  const [streamId, setStreamId] = useState<string>("1")
  const [showTipDialog, setShowTipDialog] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    params.then((p) => setStreamId(p.id))
  }, [params])

  const stream = getStreamData(streamId)

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
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black relative">
              {stream.isLive ? (
                <HLSVideoPlayer
                  src={`http://localhost:9000/media/hls/${streamId}/index.m3u8`}
                  streamKey={streamId}
                  className="w-full h-full"
                />
              ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-xl">Stream Offline</p>
                  <p className="text-sm opacity-75 mt-2">
                    This stream is currently offline
                  </p>
                </div>
              </div>
              )}

              {/* Live indicator */}
            {stream.isLive && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 hover:bg-red-600">
                  🔴 LIVE
                </Badge>
              </div>
            )}

            {/* Viewer count - auto-hiding */}
            <ViewerCount viewerCount={stream.viewerCount} />

            {/* Stream duration */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-black/60 text-white">
                {streamDuration()}
              </Badge>
            </div>
            </div>
          </Card>

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
        streamId={stream.id}
        isOpen={showTipDialog}
        onClose={() => setShowTipDialog(false)}
      />
    </div>
  )
}