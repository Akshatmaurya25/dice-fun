"use client"

// Simple in-memory database for development
// In production, this would connect to a real database

export interface StreamRecord {
  id: string
  title: string
  description?: string
  streamer_address: string
  streamer_name: string
  category: string
  stream_key: string
  rtmp_url?: string
  hls_url?: string
  is_active: boolean
  is_live: boolean
  viewer_count: number
  total_earnings: number
  started_at?: Date
  ended_at?: Date
  created_at: Date
  updated_at: Date
}

export interface TipRecord {
  id: string
  stream_id: string
  from_address: string
  to_address: string
  amount: string // in MATIC
  message?: string
  tx_hash: string
  created_at: Date
}

export interface UserRecord {
  id: string
  wallet_address: string
  email?: string
  username?: string
  total_streams: number
  total_earnings: string
  follower_count: number
  created_at: Date
  updated_at: Date
}

class DatabaseService {
  private static instance: DatabaseService
  private streams: Map<string, StreamRecord> = new Map()
  private tips: Map<string, TipRecord> = new Map()
  private users: Map<string, UserRecord> = new Map()

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Stream methods
  async createStream(data: Omit<StreamRecord, 'id' | 'created_at' | 'updated_at'>): Promise<StreamRecord> {
    const id = this.generateId()
    const now = new Date()

    const stream: StreamRecord = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
    }

    this.streams.set(id, stream)
    return stream
  }

  async getStream(id: string): Promise<StreamRecord | null> {
    return this.streams.get(id) || null
  }

  async getStreamByKey(streamKey: string): Promise<StreamRecord | null> {
    for (const stream of this.streams.values()) {
      if (stream.stream_key === streamKey) {
        return stream
      }
    }
    return null
  }

  async updateStream(id: string, updates: Partial<StreamRecord>): Promise<StreamRecord | null> {
    const stream = this.streams.get(id)
    if (!stream) return null

    const updatedStream = {
      ...stream,
      ...updates,
      updated_at: new Date(),
    }

    this.streams.set(id, updatedStream)
    return updatedStream
  }

  async getActiveStreams(): Promise<StreamRecord[]> {
    return Array.from(this.streams.values()).filter(stream => stream.is_active)
  }

  async getStreamsByStreamer(streamerAddress: string): Promise<StreamRecord[]> {
    return Array.from(this.streams.values()).filter(
      stream => stream.streamer_address.toLowerCase() === streamerAddress.toLowerCase()
    )
  }

  // Tip methods
  async createTip(data: Omit<TipRecord, 'id' | 'created_at'>): Promise<TipRecord> {
    const id = this.generateId()

    const tip: TipRecord = {
      ...data,
      id,
      created_at: new Date(),
    }

    this.tips.set(id, tip)

    // Update stream earnings
    const stream = await this.getStream(data.stream_id)
    if (stream) {
      const earnings = parseFloat(stream.total_earnings.toString()) + parseFloat(data.amount)
      await this.updateStream(stream.id, { total_earnings: earnings })
    }

    return tip
  }

  async getTipsByStream(streamId: string): Promise<TipRecord[]> {
    return Array.from(this.tips.values()).filter(tip => tip.stream_id === streamId)
  }

  async getTipsByStreamer(streamerAddress: string): Promise<TipRecord[]> {
    return Array.from(this.tips.values()).filter(
      tip => tip.to_address.toLowerCase() === streamerAddress.toLowerCase()
    )
  }

  // User methods
  async createOrUpdateUser(data: Partial<UserRecord> & { wallet_address: string }): Promise<UserRecord> {
    const existingUser = await this.getUserByAddress(data.wallet_address)

    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...data,
        updated_at: new Date(),
      }
      this.users.set(existingUser.id, updatedUser)
      return updatedUser
    }

    const id = this.generateId()
    const now = new Date()

    const user: UserRecord = {
      id,
      wallet_address: data.wallet_address,
      email: data.email,
      username: data.username || this.formatAddress(data.wallet_address),
      total_streams: 0,
      total_earnings: '0',
      follower_count: 0,
      created_at: now,
      updated_at: now,
      ...data,
    }

    this.users.set(id, user)
    return user
  }

  async getUserByAddress(address: string): Promise<UserRecord | null> {
    for (const user of this.users.values()) {
      if (user.wallet_address.toLowerCase() === address.toLowerCase()) {
        return user
      }
    }
    return null
  }

  async getUser(id: string): Promise<UserRecord | null> {
    return this.users.get(id) || null
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Analytics methods
  async getStreamAnalytics(streamId: string) {
    const stream = await this.getStream(streamId)
    if (!stream) return null

    const tips = await this.getTipsByStream(streamId)
    const totalTips = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0)
    const averageTip = tips.length > 0 ? totalTips / tips.length : 0

    return {
      stream,
      totalTips: totalTips.toFixed(4),
      tipCount: tips.length,
      averageTip: averageTip.toFixed(4),
      duration: stream.started_at && stream.ended_at ?
        stream.ended_at.getTime() - stream.started_at.getTime() : 0,
    }
  }

  async getStreamerStats(streamerAddress: string) {
    const streams = await this.getStreamsByStreamer(streamerAddress)
    const tips = await this.getTipsByStreamer(streamerAddress)
    const totalEarnings = tips.reduce((sum, tip) => sum + parseFloat(tip.amount), 0)

    return {
      totalStreams: streams.length,
      activeStreams: streams.filter(s => s.is_active).length,
      totalEarnings: totalEarnings.toFixed(4),
      totalTips: tips.length,
      averageViewers: streams.length > 0 ?
        streams.reduce((sum, s) => sum + s.viewer_count, 0) / streams.length : 0,
    }
  }

  // Initialize with some mock data
  async initializeMockData() {
    // Create mock streams
    await this.createStream({
      title: "Building DeFi Apps on Kadena",
      description: "Learn how to build decentralized applications",
      streamer_address: "0x1234567890123456789012345678901234567890",
      streamer_name: "CryptoDev",
      category: "Technology",
      stream_key: "mock_stream_1",
      rtmp_url: "rtmp://localhost:1935/live/mock_stream_1",
      hls_url: "http://localhost:8000/live/mock_stream_1/index.m3u8",
      is_active: true,
      is_live: true,
      viewer_count: 234,
      total_earnings: 12.34,
      started_at: new Date(Date.now() - 3600000), // 1 hour ago
    })

    await this.createStream({
      title: "NFT Trading Strategies",
      description: "Advanced trading techniques for NFTs",
      streamer_address: "0x2345678901234567890123456789012345678901",
      streamer_name: "TraderJoe",
      category: "Finance",
      stream_key: "mock_stream_2",
      is_active: false,
      is_live: false,
      viewer_count: 0,
      total_earnings: 8.90,
      started_at: new Date(Date.now() - 7200000), // 2 hours ago
      ended_at: new Date(Date.now() - 3600000), // 1 hour ago
    })
  }
}

export default DatabaseService