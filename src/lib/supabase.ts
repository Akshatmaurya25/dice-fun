import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface StreamData {
  id: string
  title: string
  thumbnail?: string
  streamer_address: string
  streamer_name: string
  is_live: boolean
  created_at: string
  updated_at: string
  viewer_count?: number
  stream_key?: string
}

export interface ChatMessage {
  id: string
  stream_id: string
  wallet_address: string
  username: string
  message: string
  timestamp: string
  is_streamer: boolean
  is_moderator: boolean
}