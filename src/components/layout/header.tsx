"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-foreground">KadeLive</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/browse"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/create"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Create
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
          <Button size="sm">
            Start Streaming
          </Button>
        </div>
      </div>
    </header>
  )
}