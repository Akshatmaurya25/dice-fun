import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-lg font-semibold">KadeLive</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional live streaming platform built on Kadena blockchain technology.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-medium mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/browse" className="hover:text-foreground transition-colors">
                  Browse Streams
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-foreground transition-colors">
                  Start Streaming
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-foreground transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KadeLive. Built on Kadena blockchain technology.</p>
        </div>
      </div>
    </footer>
  )
}