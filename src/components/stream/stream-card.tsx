import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StreamCardProps {
  stream: {
    id: string
    title: string
    streamerName: string
    streamerENS?: string
    viewerCount: number
    thumbnail: string
    category: string
    isLive: boolean
    streamKey?: string
  }
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {/* Placeholder for thumbnail */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-4xl text-primary/60">📺</div>
        </div>

        {/* Live indicator */}
        {stream.isLive && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
              LIVE
            </Badge>
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/60 text-white">
            {stream.viewerCount} watching
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {stream.title}
          </h3>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {stream.streamerENS || stream.streamerName}
            </p>
            <Badge variant="outline" className="text-xs">
              {stream.category}
            </Badge>
          </div>

          <Link href={`/stream/${stream.streamKey || stream.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2">
              {stream.isLive ? "📺 Watch Live" : "📹 View VOD"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}