import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StreamCard } from "@/components/stream/stream-card"
import Link from "next/link"

// Mock data for featured streams
const featuredStreams = [
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
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 relative overflow-hidden">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary rotate-45"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-primary/20 transform rotate-12"></div>
          <div className="absolute bottom-32 right-10 w-24 h-24 border-2 border-accent rotate-12"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Live Streaming
            <span className="block text-primary">Built on Kadena</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience decentralized streaming with enterprise-grade quality.
            Connect with creators, monetize content, and build communities on blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="text-lg px-8">
                Browse Streams
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Start Streaming
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Streams */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Live Streams</h2>
          <Link href="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose KadeLive?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
              <p className="text-muted-foreground">
                Built on Kadena blockchain for true ownership and censorship resistance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Payments</h3>
              <p className="text-muted-foreground">
                Instant tips and monetization through Polygon network integration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Grade</h3>
              <p className="text-muted-foreground">
                Professional quality streaming with Self Protocol verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
