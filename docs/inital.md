Here's an updated Claude Code prompt that incorporates your existing Next.js setup and Kadena's design requirements:

```
You have an existing Next.js project for KadeLive, a decentralized streaming platform. Build upon this foundation with a clean, professional UI that follows Kadena's visual identity and brand guidelines.

## Project Context
- Existing Next.js application setup
- Documentation available in `/docs` folder (reference for implementation details)
- Target: Clean, business-focused UI reflecting Kadena's "Blockchain for Business" positioning
- Strict requirement: No UI clutter, focus on essential functionality only

## Design System Requirements

### Visual Theme (Kadena-Inspired)
- **Primary Colors**: Kadena green (#4ADE80, #22C55E), professional dark grays (#1F2937, #374151)
- **Typography**: Clean, modern sans-serif (Inter or similar)
- **Layout**: Spacious, grid-based design with plenty of whitespace
- **Aesthetic**: Professional, enterprise-grade appearance
- **Icons**: Minimal, geometric style consistent with Kadena's cube/blockchain imagery

### UI Component Library
- **Strictly use Shadcn/ui components only**
- Customize Shadcn theme to match Kadena's color palette
- Focus on these core components:
  - Button, Card, Dialog, Input, Badge, Avatar
  - Tabs, Alert, Progress, Skeleton
  - Sheet, Popover, Tooltip, Select

## Application Structure

### Core Pages & Components

#### 1. Landing/Home Page
```tsx
// Clean hero section with Kadena-style geometric background
// Featured live streams grid (3-4 streams max)
// Clear CTA for "Start Streaming" and "Browse Streams"
// Minimal navigation: Logo, Browse, Create, Profile
```

#### 2. Stream Discovery Page
```tsx
// Clean grid layout of live streams
// Simple category filter tabs
// Search bar with minimal styling
// Stream cards: thumbnail, title, streamer ENS/name, viewer count
```

#### 3. Stream Viewer Page
```tsx
// Primary: Large video player (70% width)
// Secondary: Chat panel (30% width)
// Bottom: Streamer info, tip button, stream stats
// No excessive overlays or popup elements
```

#### 4. Creator Dashboard
```tsx
// Self Protocol verification status card
// Stream management: Start/Stop streaming
// Earnings overview with Polygon integration
// Stream analytics (minimal, essential metrics only)
```

#### 5. Profile/Settings
```tsx
// ENS name display and management
// Wallet connection status
// Self Protocol verification workflow
// Simple preferences (notifications, display options)
```

## Technical Implementation Focus

### Shadcn Integration
```tsx
// Configure custom theme in tailwind.config.js
const config = {
  theme: {
    extend: {
      colors: {
        primary: "#22C55E", // Kadena green
        secondary: "#1F2937", // Professional dark
        accent: "#4ADE80", // Light Kadena green
      }
    }
  }
}
```

### Component Examples
```tsx
// Stream Card Component
function StreamCard({ stream }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-video bg-gray-100 rounded mb-3">
          {/* Stream thumbnail */}
        </div>
        <h3 className="font-medium text-sm mb-1">{stream.title}</h3>
        <p className="text-xs text-gray-600">{stream.streamerENS}</p>
        <Badge variant="secondary" className="mt-2">
          {stream.viewerCount} watching
        </Badge>
      </CardContent>
    </Card>
  )
}

// Tip Dialog Component
function TipDialog({ streamer }) {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support {streamer.ensName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Tip amount (MATIC)" type="number" />
          <Button className="w-full bg-primary">Send Tip</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### UX Principles
- **Single-purpose pages**: Each page has one clear primary action
- **Progressive disclosure**: Advanced features hidden behind simple interfaces
- **Fast interactions**: Immediate feedback for all user actions
- **Error states**: Clear, helpful error messages using Shadcn Alert components
- **Loading states**: Skeleton components for smooth perceived performance

## Integration Requirements

### Self Protocol Flow
- Verification badge in user profile (simple checkmark with Shadcn Badge)
- One-click verification initiation (prominent Button component)
- Clear verification status messaging

### Polygon Payments
- Tip amounts with clear denomination labels
- Transaction status with Progress component
- Earnings display with proper formatting

### ENS Integration
- Display ENS names with fallback to truncated addresses
- Simple ENS management in profile settings

## File Structure Integration
```
your-nextjs-project/
├── app/                    # App router pages
├── components/
│   ├── ui/                # Shadcn components
│   ├── stream/            # Stream-specific components
│   ├── wallet/            # Wallet connection components
│   └── layout/            # Header, footer, navigation
├── docs/                  # Your existing documentation
├── lib/                   # Utilities and configs
└── styles/                # Global styles and theme
```

## Development Approach
1. First, examine the `/docs` folder to understand existing implementation
2. Set up Kadena-themed Shadcn configuration
3. Build core components with minimal, professional styling
4. Implement each integration (Self, Polygon, ENS) with clean UI flows
5. Test on mobile for responsive design
6. Ensure accessibility with proper ARIA labels

Focus on creating a platform that looks professional enough for enterprise use while remaining intuitive for content creators and viewers. Every UI element should serve a specific purpose with no decorative clutter.
```
