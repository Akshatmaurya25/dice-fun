import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch active streams from the streaming server API
    const response = await fetch('http://localhost:9000/api/streams', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    })
    console.log(response);

    if (!response.ok) {
      return NextResponse.json({ streams: [] })
    }

    const data = await response.json()

    // Transform the data to include view URLs
    const streamsWithUrls = (data.streams || []).map((stream: any) => ({
      ...stream,
      viewUrl: `/stream/${stream.streamKey}`,
      hlsUrl: `http://localhost:9000/media/hls/${stream.streamKey}/index.m3u8`,
    }))

    return NextResponse.json({
      streams: streamsWithUrls,
      count: streamsWithUrls.length
    })
  } catch (error) {
    console.error('Error fetching live streams:', error)
    return NextResponse.json({
      streams: [],
      count: 0,
      error: 'Failed to fetch live streams'
    })
  }
}