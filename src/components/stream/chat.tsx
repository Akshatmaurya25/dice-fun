"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePrivyWallet } from "@/hooks/usePrivyWallet"

interface ChatMessage {
  id: string
  username: string
  ensName?: string
  message: string
  timestamp: Date
  isStreamer?: boolean
  isModerator?: boolean
}

interface ChatProps {
  streamId: string
  streamerName: string
}

// Mock chat messages
const initialMessages: ChatMessage[] = [
  {
    id: "1",
    username: "viewer1",
    ensName: "viewer1.kda",
    message: "Great stream! Learning a lot about DeFi",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    username: "cryptodev",
    ensName: "cryptodev.kda",
    message: "Thanks for joining! We'll cover smart contract security next",
    timestamp: new Date(Date.now() - 240000),
    isStreamer: true,
  },
  {
    id: "3",
    username: "moderator",
    message: "Remember to follow community guidelines",
    timestamp: new Date(Date.now() - 180000),
    isModerator: true,
  },
  {
    id: "4",
    username: "defi_enthusiast",
    message: "Can you explain the yield farming strategy again?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "5",
    username: "kadena_builder",
    ensName: "builder.kda",
    message: "This is exactly what I needed for my project!",
    timestamp: new Date(Date.now() - 60000),
  },
]

export function Chat({ streamId: _streamId, streamerName: _streamerName }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isConnected, address, formatAddress, connectWallet, userEmail, user } = usePrivyWallet()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: userEmail || (address ? formatAddress(address) : "Anonymous"),
      message: newMessage.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Stream Chat
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 max-h-96">
          {messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-medium ${
                        msg.isStreamer
                          ? "text-primary"
                          : msg.isModerator
                          ? "text-purple-600"
                          : "text-foreground"
                      }`}
                    >
                      {msg.ensName || msg.username}
                    </span>
                    {msg.isStreamer && (
                      <Badge variant="default" className="text-xs h-4">
                        Streamer
                      </Badge>
                    )}
                    {msg.isModerator && (
                      <Badge variant="outline" className="text-xs h-4">
                        Mod
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          {!isConnected ? (
            <Button
              onClick={connectWallet}
              className="w-full"
              variant="outline"
            >
              Connect to Chat
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}