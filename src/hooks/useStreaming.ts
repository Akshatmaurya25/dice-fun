"use client"

import { useState, useEffect } from 'react'
import { StreamingService, StreamState } from '@/lib/streaming'

export function useStreaming() {
  const [streamState, setStreamState] = useState<StreamState>({
    isStreaming: false,
    isLive: false,
    title: "",
    category: "Technology",
    viewers: 0,
    duration: "00:00:00",
    startTime: null,
    rtmpUrl: null,
    streamKey: null,
  })
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)

  useEffect(() => {
    const streamingService = StreamingService.getInstance()
    const unsubscribe = streamingService.subscribe(setStreamState)

    return unsubscribe
  }, [])

  const startStream = async (title: string, category: string = "Technology") => {
    setIsStarting(true)
    try {
      const streamingService = StreamingService.getInstance()
      const result = await streamingService.startStream(title, category)

      if (!result.success) {
        alert(result.error || "Failed to start stream")
        return null
      }

      return {
        rtmpUrl: result.rtmpUrl!,
        streamKey: result.streamKey!,
      }
    } catch (error) {
      console.error("Failed to start stream:", error)
      alert("Failed to start stream")
      return null
    } finally {
      setIsStarting(false)
    }
  }

  const stopStream = async () => {
    setIsStopping(true)
    try {
      const streamingService = StreamingService.getInstance()
      const result = await streamingService.stopStream()

      if (!result.success) {
        alert(result.error || "Failed to stop stream")
        return false
      }

      return true
    } catch (error) {
      console.error("Failed to stop stream:", error)
      alert("Failed to stop stream")
      return false
    } finally {
      setIsStopping(false)
    }
  }

  const updateStreamInfo = (title: string, category: string) => {
    const streamingService = StreamingService.getInstance()
    streamingService.updateStreamInfo(title, category)
  }

  const getStreamStats = () => {
    const streamingService = StreamingService.getInstance()
    return streamingService.getStreamStats()
  }

  return {
    ...streamState,
    isStarting,
    isStopping,
    startStream,
    stopStream,
    updateStreamInfo,
    getStreamStats,
  }
}