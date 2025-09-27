"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StreamCard } from "@/components/stream/stream-card"
import { LiveStreams } from "@/components/stream/live-streams"
import { ServerStatus } from "@/components/stream/server-status"
import { StreamingService } from "@/lib/streaming"

// Mock data for streams
const allStreams = [
  {
    id: "1",
    title: "Building DeFi Apps on Kadena",
    streamerName: "CryptoDev",
    streamerENS: "cryptodev.kda",
    viewerCount: 234,
    thumbnail: "",
    category: "Technology",
    isLive: true,
  },
  {
    id: "2",
    title: "NFT Trading Strategies",
    streamerName: "TraderJoe",
    viewerCount: 156,
    thumbnail: "",
    category: "Finance",
    isLive: true,
  },
  {
    id: "3",
    title: "Smart Contract Security Review",
    streamerName: "SecurityExpert",
    streamerENS: "security.kda",
    viewerCount: 89,
    thumbnail: "",
    category: "Education",
    isLive: true,
  },
  {
    id: "4",
    title: "Blockchain Gaming Discussion",
    streamerName: "GameDev",
    viewerCount: 67,
    thumbnail: "",
    category: "Gaming",
    isLive: false,
  },
  {
    id: "5",
    title: "Kadena Ecosystem Updates",
    streamerName: "KadenaCore",
    streamerENS: "core.kda",
    viewerCount: 445,
    thumbnail: "",
    category: "Technology",
    isLive: true,
  },
  {
    id: "6",
    title: "Web3 UX Design Principles",
    streamerName: "DesignGuru",
    viewerCount: 123,
    thumbnail: "",
    category: "Education",
    isLive: true,
  },
  {
    id: "7",
    title: "DeFi Yield Farming Guide",
    streamerName: "YieldMaster",
    streamerENS: "yield.kda",
    viewerCount: 298,
    thumbnail: "",
    category: "Finance",
    isLive: true,
  },
  {
    id: "8",
    title: "Play-to-Earn Game Review",
    streamerName: "GameReviewer",
    viewerCount: 89,
    thumbnail: "",
    category: "Gaming",
    isLive: false,
  },
]

const categories = [
  { id: "all", label: "All Streams" },
  { id: "Technology", label: "Technology" },
  { id: "Finance", label: "Finance" },
  { id: "Education", label: "Education" },
  { id: "Gaming", label: "Gaming" },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [serverStreams, setServerStreams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [serverOnline, setServerOnline] = useState(false)

  // Fetch streams from server
  useEffect(() => {
    const fetchStreams = async () => {
      if (!serverOnline) {
        setLoading(false)
        return
      }

      try {
        const streamingService = StreamingService.getInstance()
        const streams = await streamingService.fetchActiveStreams()

        // Convert server streams to the format expected by StreamCard
        const convertedStreams = streams.map((stream: any) => ({
          id: stream.id,
          title: stream.title,
          streamerName: stream.streamer_id,
          streamerENS: stream.streamer_id + '.kda',
          viewerCount: stream.viewer_count || 0,
          thumbnail: "",
          category: stream.category,
          isLive: stream.is_active,
          streamKey: stream.stream_key,
        }))

        setServerStreams(convertedStreams)
      } catch (error) {
        console.error('Failed to fetch streams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreams()
  }, [serverOnline])

  // Combine server streams with mock streams for demo
  const allStreamsCombined = serverOnline ? [...serverStreams, ...allStreams] : allStreams

  const filteredStreams = allStreamsCombined.filter((stream) => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.streamerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (stream.streamerENS && stream.streamerENS.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || stream.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const liveStreams = filteredStreams.filter(stream => stream.isLive)
  const offlineStreams = filteredStreams.filter(stream => !stream.isLive)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Live Streams</h1>
        <p className="text-muted-foreground text-lg">
          Explore professional content creators on the Kadena ecosystem
        </p>
      </div>

      {/* Server Status */}
      <div className="mb-8">
        <ServerStatus onServerStatusChange={setServerOnline} />
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="max-w-md">
          <Input
            placeholder="Search streams, creators, or ENS names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-sm">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredStreams.length} streams found
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Live Streams */}
      {liveStreams.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold">Live Now ({liveStreams.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {/* Offline Streams */}
      {offlineStreams.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Streamed ({offlineStreams.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offlineStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredStreams.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No streams found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or browse different categories
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}