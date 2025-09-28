"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Bookmark, Play, Eye, Clock, TrendingUp, Plus } from "lucide-react"
import { socialPosts, categories, type SocialPost } from "@/data/social-posts"
import { PostUploadModal } from "@/components/modals/post-upload-modal"

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set(["2", "5"]))
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  const filteredPosts = selectedCategory === "all"
    ? socialPosts
    : socialPosts.filter(post => post.category === selectedCategory)

  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  const handleBookmark = (postId: string) => {
    const newBookmarkedPosts = new Set(bookmarkedPosts)
    if (newBookmarkedPosts.has(postId)) {
      newBookmarkedPosts.delete(postId)
    } else {
      newBookmarkedPosts.add(postId)
    }
    setBookmarkedPosts(newBookmarkedPosts)
  }

  const PostCard = ({ post }: { post: SocialPost }) => {
    const isLiked = likedPosts.has(post.id)
    const isBookmarked = bookmarkedPosts.has(post.id)

    return (
      <Card className="mb-6 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {post.author.avatar}
                </span>
              </div>

              {/* Author Info */}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-sm">{post.author.name}</h4>
                  {post.author.verified && (
                    <Badge className="text-xs bg-blue-500 hover:bg-blue-600">✓</Badge>
                  )}
                  {post.trending && (
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">@{post.author.username} · {post.timestamp}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Content */}
          <div className="mb-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {/* Media */}
          {post.type === "video" && post.videoUrl && (
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <video
              
                controls
                muted={true}
                autoPlay
                className="w-full aspect-video bg-black"
                poster="/api/placeholder/600/400"
              >
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {post.views?.toLocaleString()} views
              </div>
              {post.duration && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.duration}
                </div>
              )}
            </div>
          )}

          {post.type === "image" && post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="w-full aspect-video object-cover bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/api/placeholder/600/400";
                }}
              />
            </div>
          )}

          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-xs">
                {categories.find(c => c.id === post.category)?.icon} {post.category}
              </Badge>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center space-x-6">
              {/* Like */}
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 text-sm transition-colors ${
                  isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes + (isLiked ? 1 : 0)}</span>
              </button>

              {/* Comment */}
              <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>

              {/* Share */}
              <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-green-500 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => handleBookmark(post.id)}
              className={`transition-colors ${
                isBookmarked ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Browse</h1>
            <p className="text-muted-foreground">
              Discover the latest from the Kadena community
            </p>
          </div>
          <Button
            onClick={() => setIsPostModalOpen(true)}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-sm">
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Posts Feed */}
      <div className="space-y-0">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>

      {/* Post Upload Modal */}
      <PostUploadModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  )
}