# Local Development Setup for Self.xyz

## Quick Setup Guide

### 1. Start your Next.js development server
```bash
npm run dev
```
Note the port it's running on (likely 3001 if 3000 is busy).

### 2. Start ngrok tunnel
In a new terminal, run:
```bash
ngrok http 3001 --request-header-add "ngrok-skip-browser-warning:true"
```

### 3. Update environment variables
Copy the HTTPS URL from ngrok (something like `https://abc123.ngrok-free.app`) and update your `.env.local`:

```bash
# Self.xyz Configuration
NEXT_PUBLIC_SELF_APP_NAME="Dice Fun - Identity Verification"
NEXT_PUBLIC_SELF_SCOPE="dice-fun-app"
NEXT_PUBLIC_SELF_ENDPOINT="https://your-ngrok-url.ngrok-free.app"

# Self.xyz Backend Configuration
SELF_SCOPE="dice-fun-app"
SELF_ENDPOINT="https://your-ngrok-url.ngrok-free.app/api/verify"
```

### 4. Restart your Next.js server
After updating the environment variables:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Troubleshooting

### Error: "localhost endpoints are not allowed"
- Make sure you're using the ngrok HTTPS URL in your environment variables
- Restart your Next.js server after changing environment variables

### Error: "proof_generation_failed" with HTML content
- This means ngrok is showing a browser warning page
- Make sure you're using the `--request-header-add "ngrok-skip-browser-warning:true"` flag
- Or visit the ngrok URL in your browser and click "Visit Site" to bypass the warning

### Error: "tunnel not found"
- Make sure ngrok is running and pointing to the correct port
- Check that your Next.js server is running on the expected port

## Testing the Setup

1. Visit your ngrok URL directly: `https://your-ngrok-url.ngrok-free.app/api/verify`
2. You should see a JSON response: `{"status":"ok","message":"Self.xyz verification endpoint is running"}`
3. If you see HTML instead, the ngrok tunnel isn't configured correctly

## Alternative: Use Self.xyz Mock Mode

For quick testing without ngrok, you can use mock mode:

1. Update your backend verifier in `src/app/api/verify/route.ts`:
```typescript
const selfBackendVerifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE || "dice-fun-app",
  process.env.SELF_ENDPOINT || "https://your-ngrok-url/api/verify",
  true, // Set to true for mock mode - this bypasses real verification
  AllIds,
  // ... rest of config
);
```

**Note:** Mock mode should only be used for development testing!