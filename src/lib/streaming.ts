"use client"

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

  async startStream(title: string, category: string = "Technology"): Promise<{ success: boolean; rtmpUrl?: string; streamKey?: string; error?: string }> {
    try {
      if (this.state.isStreaming) {
        return { success: false, error: "Already streaming" }
      }

      // Generate RTMP credentials (in a real app, this would come from your streaming server)
      const rtmpUrl = "rtmp://live.kadelive.com/live"
      const streamKey = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

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

      // Simulate going live after a few seconds (in real app, this would be triggered by RTMP server)
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

  goLive() {
    if (this.state.isStreaming) {
      this.state.isLive = true
      // Simulate some initial viewers
      this.state.viewers = Math.floor(Math.random() * 10) + 1
      this.notifyListeners()

      // Simulate viewer count changes
      const viewerInterval = setInterval(() => {
        if (this.state.isLive) {
          const change = Math.floor(Math.random() * 6) - 2 // -2 to +3 viewers
          this.state.viewers = Math.max(0, this.state.viewers + change)
          this.notifyListeners()
        } else {
          clearInterval(viewerInterval)
        }
      }, 10000) // Update every 10 seconds
    }
  }

  stopStream(): { success: boolean; error?: string } {
    try {
      if (!this.state.isStreaming) {
        return { success: false, error: "Not currently streaming" }
      }

      // Clear duration timer
      if (this.durationInterval) {
        clearInterval(this.durationInterval)
        this.durationInterval = null
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

  getStreamStats() {
    return {
      uptime: this.state.duration,
      viewers: this.state.viewers,
      isLive: this.state.isLive,
      bitrate: this.state.isLive ? `${1500 + Math.floor(Math.random() * 1000)} kbps` : "0 kbps",
      fps: this.state.isLive ? 30 : 0,
    }
  }
}