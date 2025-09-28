// Social media posts data for the browse/feed page
// You can easily modify this array to customize the posts

export interface SocialPost {
  id: string
  type: "text" | "video" | "image"
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  videoUrl?: string
  imageUrl?: string
  duration?: string
  views?: number
  timestamp: string
  likes: number
  comments: number
  shares: number
  bookmarked: boolean
  trending?: boolean
  category?: string
}

export const socialPosts: SocialPost[] = [
  {
    id: "1",
    type: "text",
    author: {
      name: "Akshat Maurya",
      username: "akku_dev",
      avatar: "AM",
      verified: true
    },
    content: "Just deployed my first smart contract on Kadena! 🚀 The performance is incredible compared to other chains. Zero gas fees and instant finality. Building the future of DeFi one block at a time! #Kadena #Web3 #DeFi",
    timestamp: "2h",
    likes: 12,
    comments: 0,
    shares: 2,
    bookmarked: false,
    trending: true
  },
  {
    id: "2",
    type: "video",
    author: {
      name: "CryptoDev",
      username: "cryptodev_kda",
      avatar: "CD",
      verified: true
    },
    content: "Building a decentralized streaming platform - Live coding session! Join me as we implement real-time tipping with Kadena smart contracts.",
    videoUrl: "https://fuchsia-nearby-unicorn-941.mypinata.cloud/ipfs/bafybeickl6dkoh4xtagg6ztoce7m6s2dhklxvcjnirss42t3rxu2uks5ru",
    duration: "45:32",
    views: 87,
    timestamp: "4h",
    likes: 8,
    comments: 0,
    shares: 1,
    bookmarked: true,
    category: "Technology"
  },
  {
    id: "3",
    type: "text",
    author: {
      name: "Luna Chen",
      username: "luna_defi",
      avatar: "LC",
      verified: false
    },
    content: "Market analysis: Kadena (KDA) showing strong fundamentals. The adoption of their chainweb technology by enterprises is accelerating. Perfect time to dive deeper into the ecosystem! 📈",
    timestamp: "6h",
    likes: 15,
    comments: 0,
    shares: 3,
    bookmarked: false,
    trending: true
  },
  {
    id: "4",
    type: "image",
    author: {
      name: "Giri",
      username: "Giri",
      avatar: "GD",
      verified: true
    },
    content: "Sneak peek of our new P2E game built on Kadena! 🎮 Players can earn real KDA tokens while battling in this fantasy world. Beta testing starts next week!",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=entropy",
    timestamp: "8h",
    likes: 9,
    comments: 0,
    shares: 2,
    bookmarked: false,
    category: "Gaming"
  },
  {
    id: "5",
    type: "video",
    author: {
      name: "Akshat Maurya",
      username: "akku_dev",
      avatar: "AM",
      verified: true
    },
    content: "This ni**a broke valo man! 🥲",
    videoUrl: "https://fuchsia-nearby-unicorn-941.mypinata.cloud/ipfs/bafybeidj373iev2a43wcf4bukdtngcvht5w3ymdyftccuz5i3sto67p5qm",
    duration: "0:45",
    views: 45,
    timestamp: "12h",
    likes: 6,
    comments: 0,
    shares: 1,
    bookmarked: true,
    category: "Gaming"
  },
  {
    id: "6",
    type: "text",
    author: {
      name: "DeFi Researcher",
      username: "defi_research",
      avatar: "DR",
      verified: true
    },
    content: "Fascinating research: Kadena's unique approach to scalability through braided chains allows for infinite scaling while maintaining security. This could be the solution to the blockchain trilemma! 🧵",
    timestamp: "1d",
    likes: 11,
    comments: 0,
    shares: 4,
    bookmarked: false,
    trending: true
  },
  {
    id: "7",
    type: "image",
    author: {
      name: "NFT Artist",
      username: "nft_creator",
      avatar: "NA",
      verified: false
    },
    content: "Just minted my latest collection on Kadena! The speed and cost efficiency is amazing. Each NFT costs less than $0.01 to mint vs $50+ on other chains 🎨",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=400&fit=crop&crop=entropy",
    timestamp: "1d",
    likes: 7,
    comments: 0,
    shares: 1,
    bookmarked: false,
    category: "Art"
  },
  {
    id: "8",
    type: "video",
    author: {
      name: "TradingPro",
      username: "trading_pro",
      avatar: "TP",
      verified: true
    },
    content: "Live market analysis: KDA price action and technical indicators. Strong support at $0.85, potential breakout incoming! 📊",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    duration: "15:20",
    views: 52,
    timestamp: "2d",
    likes: 4,
    comments: 0,
    shares: 1,
    bookmarked: false,
    category: "Finance"
  },
  {
    id: "9",
    type: "text",
    author: {
      name: "Akshat Maurya",
      username: "akku_dev",
      avatar: "AM",
      verified: true
    },
    content: "Working late tonight on the dice.fun platform! 🎲 Integrating Self Protocol for identity verification. This will make streaming safer and more trustworthy for everyone. Can't wait to ship this feature! #BuildInPublic",
    timestamp: "3d",
    likes: 5,
    comments: 0,
    shares: 1,
    bookmarked: false,
    trending: false
  },
  {
    id: "10",
    type: "image",
    author: {
      name: "Blockchain News",
      username: "blockchain_news",
      avatar: "BN",
      verified: true
    },
    content: "BREAKING: Major enterprise adopts Kadena for supply chain tracking. The scalability and energy efficiency of Kadena's Proof of Work is proving to be game-changing for real-world applications! 🌍",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&crop=entropy",
    timestamp: "4d",
    likes: 14,
    comments: 0,
    shares: 3,
    bookmarked: false,
    trending: true,
    category: "Technology"
  }
]

export const categories = [
  { id: "all", label: "For You", icon: "🏠" },
  { id: "Technology", label: "Technology", icon: "💻" },
  { id: "Finance", label: "Finance", icon: "💰" },
  { id: "Education", label: "Education", icon: "🎓" },
  { id: "Gaming", label: "Gaming", icon: "🎮" },
  { id: "Art", label: "Art", icon: "🎨" },
]

// Helper function to add new posts
export const addPost = (post: Omit<SocialPost, 'id'>): SocialPost => {
  return {
    ...post,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Helper function to get posts by category
export const getPostsByCategory = (category: string): SocialPost[] => {
  if (category === "all") return socialPosts
  return socialPosts.filter(post => post.category === category)
}

// Helper function to get trending posts
export const getTrendingPosts = (): SocialPost[] => {
  return socialPosts.filter(post => post.trending)
}

// Helper function to get posts by user
export const getPostsByUser = (username: string): SocialPost[] => {
  return socialPosts.filter(post => post.author.username === username)
}