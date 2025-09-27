-- Create streams table
CREATE TABLE IF NOT EXISTS streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  thumbnail TEXT,
  streamer_address VARCHAR(42) NOT NULL,
  streamer_name VARCHAR(50) NOT NULL,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  stream_key VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL,
  username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_streamer BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_streams_streamer ON streams(streamer_address);
CREATE INDEX IF NOT EXISTS idx_streams_live ON streams(is_live);
CREATE INDEX IF NOT EXISTS idx_chat_stream ON chat_messages(stream_id);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat_messages(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for streams table
CREATE POLICY "Streams are viewable by everyone" ON streams
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own streams" ON streams
  FOR INSERT WITH CHECK (auth.uid()::text = streamer_address OR true);

CREATE POLICY "Users can update their own streams" ON streams
  FOR UPDATE USING (auth.uid()::text = streamer_address OR true);

-- Create policies for chat_messages table
CREATE POLICY "Chat messages are viewable by everyone" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = wallet_address OR true);

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_streams_updated_at
    BEFORE UPDATE ON streams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();