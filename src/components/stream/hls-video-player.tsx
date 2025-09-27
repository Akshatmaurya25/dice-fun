"use client"

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react'

interface HLSVideoPlayerProps {
  src: string
  streamKey: string
  className?: string
}

const getHLSUrls = (streamKey: string) => [
  `http://localhost:9000/media/hls/${streamKey}/index.m3u8`,
  `http://localhost:8000/live/${streamKey}/index.m3u8`,
  `http://localhost:8000/live/${streamKey}.m3u8`,
  `http://localhost:8000/live/${streamKey}/playlist.m3u8`
]

export function HLSVideoPlayer({ src, streamKey, className = "" }: HLSVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'error' | 'retry'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const initHLS = async () => {
      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      const urls = getHLSUrls(streamKey)
      let successfulUrl = null

      // Try to find a working HLS URL
      for (const url of urls) {
        try {
          const response = await fetch(url, { method: 'HEAD' })
          if (response.ok) {
            successfulUrl = url
            console.log('Found working HLS URL:', url)
            break
          }
        } catch (error) {
          console.log('URL not available:', url)
        }
      }

      if (!successfulUrl) {
        console.log('No HLS streams available, trying original URL:', src)
        successfulUrl = src
      }

      if (Hls.isSupported()) {
        console.log('HLS.js is supported, loading stream:', successfulUrl)

        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferLength: 60,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10
        })

        hlsRef.current = hls

        hls.loadSource(successfulUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed for stream:', streamKey)
          setStatus('playing')
          // Small delay before playing
          setTimeout(() => {
            video.play().catch((error) => {
              console.log('Autoplay failed, user interaction required:', error)
            })
          }, 500)
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data)
          if (data.fatal) {
            setStatus('error')
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error, will retry...')
                setTimeout(() => setStatus('retry'), 2000)
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, recovering...')
                hls.recoverMediaError()
                break
              default:
                console.log('Fatal error, destroying HLS instance')
                hls.destroy()
                setTimeout(() => setStatus('retry'), 2000)
                break
            }
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected')
        video.src = successfulUrl
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((error) => {
            console.log('Autoplay failed:', error)
          })
        })
      } else {
        console.error('HLS is not supported in this browser')
      }
    }

    // Small delay to ensure proper initialization
    const timer = setTimeout(initHLS, 500)

    return () => {
      clearTimeout(timer)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, retryCount])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const timeout = setTimeout(() => setShowControls(false), 3000)
    setControlsTimeout(timeout)
  }

  const handlePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleVolumeToggle = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`relative ${className} group`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-black"
        muted
        playsInline
        preload="none"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23000'/%3E%3Ctext x='200' y='112' fill='%23fff' text-anchor='middle' font-size='20'%3ELoading Stream...%3C/text%3E%3C/svg%3E"
      />

      {/* Status Overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <div>Loading stream...</div>
            <div className="text-xs mt-2 opacity-75">Stream: {streamKey.slice(-12)}</div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="text-red-500 text-2xl mb-4">❌</div>
            <div>Stream unavailable</div>
            <div className="text-xs mt-2 opacity-75">Checking for stream...</div>
          </div>
        </div>
      )}

      {status === 'retry' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="text-yellow-500 text-2xl mb-4">🔄</div>
            <div className="mb-4">Stream not found</div>
            <Button
              onClick={() => {
                setRetryCount(prev => prev + 1)
                setStatus('loading')
              }}
              variant="outline"
              size="sm"
            >
              Retry ({retryCount + 1})
            </Button>
            <div className="text-xs mt-2 opacity-75">Make sure OBS is streaming to: {streamKey.slice(-12)}</div>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {status === 'playing' && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-3">
            <div
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                }}
              />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20 p-2"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleVolumeToggle}
                className="text-white hover:bg-white/20 p-2"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>

              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm opacity-75">🔴 LIVE</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20 p-2"
              >
                <Maximize size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}