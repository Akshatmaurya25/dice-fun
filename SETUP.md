# Setup Instructions

## Overview

This application now includes:

1. **Wallet Connection Enforcement** - Users must connect their wallet to use chat and streaming features
2. **Fixed Tip Function** - Removed ENS name resolution that was causing errors
3. **Supabase Integration** - Database for stream data and chat messages
4. **Stream Configuration Modal** - Popup for setting stream title and description

## Quick Setup

### 1. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Create Database Tables

Run the SQL script in the Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-tables.sql
```

Or directly execute:
```bash
# If you have Supabase CLI installed
supabase db reset
```

### 3. Test the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test wallet connection:**
   - Go to `/dashboard`
   - You should see a wallet connection prompt
   - Connect your wallet to proceed

3. **Test stream configuration:**
   - In the dashboard, click "Configure & Start Stream"
   - Fill in stream title and description
   - The modal should save data to Supabase

4. **Test chat functionality:**
   - Go to any stream page (e.g., `/stream/test`)
   - Try to chat without connecting wallet (should prompt connection)
   - Connect wallet and try chatting (should show wallet address as username)

## Key Changes Made

### Wallet Connection Enforcement

- Created `WalletGuard` component that wraps protected pages
- Updated chat component to require wallet connection
- Added wallet address display as username in chat

### Fixed Tip Function Error

- Removed ENS name resolution from tip dialog
- Updated interface to only use `name` and `address` properties
- Fixed "invalid ENS name" error that was occurring

### Supabase Integration

- Added `@supabase/supabase-js` dependency
- Created database schema for streams and chat messages
- Added Supabase client configuration

### Stream Configuration Modal

- New modal popup for stream configuration
- Form validation for required fields
- Thumbnail upload placeholder (disabled for now)
- Integration with Supabase for data persistence

## Troubleshooting

### Common Issues

1. **"Invalid ENS name" error**
   - Fixed by removing ENS resolution from tip function
   - Make sure you're using the updated TipDialog component

2. **Wallet not connecting**
   - Check browser console for errors
   - Ensure MetaMask or compatible wallet is installed
   - Try refreshing the page

3. **Supabase connection issues**
   - Verify environment variables are set correctly
   - Check Supabase project is active
   - Ensure database tables are created

4. **Modal not appearing**
   - Check browser console for React errors
   - Ensure all dependencies are installed
   - Try clearing browser cache

## Next Steps

1. **Configure your Supabase credentials** in `.env.local`
2. **Run the database migration** using the provided SQL script
3. **Test all functionality** with a connected wallet
4. **Deploy when ready** - remember to set environment variables in production

## Files Modified/Created

- `src/lib/supabase.ts` - Supabase client configuration
- `src/components/wallet/wallet-guard.tsx` - Wallet connection enforcement
- `src/components/modals/stream-config-modal.tsx` - Stream configuration modal
- `src/components/stream/chat.tsx` - Updated for wallet enforcement
- `src/components/stream/tip-dialog.tsx` - Fixed ENS error
- `src/app/dashboard/page.tsx` - Added wallet guard and modal integration
- `supabase-tables.sql` - Database schema
- `.env.example` - Updated with Supabase variables