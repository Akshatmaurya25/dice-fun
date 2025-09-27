"use client"

import DatabaseService from '@/lib/database'

export interface StreamState {
  isStreaming: boolean
  isLive: boolean
  title: string
  category: string
  viewers: number
  duration: string
  startTime: Date | null
  rtmpUrl: string | null
  streamKey: string | null
}

export class StreamingService {
  private static instance: StreamingService
  private state: StreamState = {
    isStreaming: false,
    isLive: false,
    title: "",
    category: "Technology",
    viewers: 0,
    duration: "00:00:00",
    startTime: null,
    rtmpUrl: null,
    streamKey: null,
  }
  private listeners: ((state: StreamState) => void)[] = []
  private durationInterval: NodeJS.Timeout | null = null
  private statusCheckInterval: NodeJS.Timeout | null = null
  private streamingServerUrl = 'http://localhost:9000'
  private database: DatabaseService
  private currentStreamId: string | null = null

  constructor() {
    this.database = DatabaseService.getInstance()
    // Initialize with mock data for development
    this.database.initializeMockData()
  }

  static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService()
    }
    return StreamingService.instance
  }

  subscribe(listener: (state: StreamState) => void) {
    this.listeners.push(listener)
    listener(this.state)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  private updateDuration() {
    if (this.state.startTime) {
      const now = new Date()
      const diff = now.getTime() - this.state.startTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      this.state.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      this.notifyListeners()
    }
  }

  async startStream(title: string, category: string = "Technology", streamerAddress?: string): Promise<{ success: boolean; rtmpUrl?: string; streamKey?: string; error?: string }> {
    try {
      if (this.state.isStreaming) {
        return { success: false, error: "Already streaming" }
      }

      // Generate stream key and RTMP URL
      const streamKey = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const rtmpUrl = `rtmp://localhost:1935/live`

      // Create stream record in database
      const streamRecord = await this.database.createStream({
        title,
        category,
        streamer_address: streamerAddress || 'unknown',
        streamer_name: `Streamer ${streamerAddress?.slice(0, 6) || 'Unknown'}`,
        stream_key: streamKey,
        rtmp_url: rtmpUrl,
        is_active: true,
        is_live: false,
        viewer_count: 0,
        total_earnings: 0,
        started_at: new Date(),
      })

      this.currentStreamId = streamRecord.id

      // Try to create stream in streaming server if available
      try {
        const response = await fetch(`${this.streamingServerUrl}/api/streams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            category,
            streamer_id: streamerAddress || 'user123',
            stream_key: streamKey,
          }),
        })

        if (!response.ok) {
          console.warn('Streaming server not available, using fallback')
        }
      } catch (error) {
        console.warn('Streaming server not available, using fallback mode')
      }

      this.state = {
        ...this.state,
        isStreaming: true,
        isLive: false, // Will become true when RTMP connection is established
        title,
        category,
        viewers: 0,
        startTime: new Date(),
        rtmpUrl,
        streamKey,
      }

      // Start duration timer
      this.durationInterval = setInterval(() => {
        this.updateDuration()
      }, 1000)

      // Simulate going live after a few seconds
      setTimeout(() => {
        this.goLive()
      }, 3000)

      this.notifyListeners()

      return {
        success: true,
        rtmpUrl,
        streamKey,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to start stream"
      }
    }
  }

  async goLive() {
    if (this.state.isStreaming) {
      this.state.isLive = true
      // Simulate some initial viewers
      this.state.viewers = Math.floor(Math.random() * 10) + 1

      // Update database record
      if (this.currentStreamId) {
        await this.database.updateStream(this.currentStreamId, {
          is_live: true,
          viewer_count: this.state.viewers,
        })
      }

      this.notifyListeners()

      // Simulate viewer count changes
      const viewerInterval = setInterval(async () => {
        if (this.state.isLive) {
          const change = Math.floor(Math.random() * 6) - 2 // -2 to +3 viewers
          this.state.viewers = Math.max(0, this.state.viewers + change)

          // Update database with new viewer count
          if (this.currentStreamId) {
            await this.database.updateStream(this.currentStreamId, {
              viewer_count: this.state.viewers,
            })
          }

          this.notifyListeners()
        } else {
          clearInterval(viewerInterval)
        }
      }, 10000) // Update every 10 seconds
    }
  }

  async stopStream(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.state.isStreaming) {
        return { success: false, error: "Not currently streaming" }
      }

      // Stop stream on server if we have a stream key
      if (this.state.streamKey) {
        try {
          await fetch(`${this.streamingServerUrl}/api/streams/${this.state.streamKey}/stop`, {
            method: 'POST',
          })
        } catch (error) {
          console.warn('Failed to notify server of stream stop:', error)
        }
      }

      // Update database record to mark stream as ended
      if (this.currentStreamId) {
        await this.database.updateStream(this.currentStreamId, {
          is_active: false,
          is_live: false,
          ended_at: new Date(),
        })
        this.currentStreamId = null
      }

      // Clear intervals
      if (this.durationInterval) {
        clearInterval(this.durationInterval)
        this.durationInterval = null
      }
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval)
        this.statusCheckInterval = null
      }

      this.state = {
        ...this.state,
        isStreaming: false,
        isLive: false,
        viewers: 0,
        startTime: null,
        rtmpUrl: null,
        streamKey: null,
        duration: "00:00:00",
      }

      this.notifyListeners()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to stop stream"
      }
    }
  }

  updateStreamInfo(title: string, category: string) {
    this.state.title = title
    this.state.category = category
    this.notifyListeners()
  }

  getState(): StreamState {
    return { ...this.state }
  }

  // RTMP Server Integration Functions
  async checkRTMPConnection(): Promise<boolean> {
    // In a real app, this would ping your RTMP server
    return this.state.isStreaming
  }

  private startStatusChecking(streamKey: string) {
    this.statusCheckInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.streamingServerUrl}/api/streams/${streamKey}/status`)
        if (response.ok) {
          const status = await response.json()

          // Update state based on server status
          const wasLive = this.state.isLive
          this.state.isLive = status.isLive
          this.state.viewers = status.viewerCount

          // If just went live, notify listeners
          if (!wasLive && status.isLive) {
            console.log('🔴 Stream went live!')
          }

          this.notifyListeners()
        }
      } catch (error) {
        console.warn('Failed to check stream status:', error)
      }
    }, 5000) // Check every 5 seconds
  }

  async fetchActiveStreams() {
    try {
      const response = await fetch(`${this.streamingServerUrl}/api/streams`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to fetch active streams:', error)
    }
    return []
  }

  async getStreamDetails(streamKey: string) {
    try {
      const response = await fetch(`${this.streamingServerUrl}/api/streams/${streamKey}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn('Failed to fetch stream details:', error)
    }
    return null
  }

  getStreamStats() {
    return {
      uptime: this.state.duration,
      viewers: this.state.viewers,
      isLive: this.state.isLive,
      bitrate: this.state.isLive ? `${1500 + Math.floor(Math.random() * 1000)} kbps` : "0 kbps",
      fps: this.state.isLive ? 30 : 0,
    }
  }

  async getActiveStreams() {
    return await this.database.getActiveStreams()
  }

  async getStreamsByStreamer(streamerAddress: string) {
    return await this.database.getStreamsByStreamer(streamerAddress)
  }

  async getStreamAnalytics(streamId: string) {
    return await this.database.getStreamAnalytics(streamId)
  }

  async getStreamerStats(streamerAddress: string) {
    return await this.database.getStreamerStats(streamerAddress)
  }

  async getTipsByStream(streamId: string) {
    return await this.database.getTipsByStream(streamId)
  }

  getCurrentStreamId(): string | null {
    return this.currentStreamId
  }
}