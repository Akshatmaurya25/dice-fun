# Self.xyz Identity Verification Integration

This project includes a complete Self.xyz identity verification system that allows users to verify their identity using zero-knowledge proofs without revealing personal information.

## Features

- 🛡️ **Privacy-First**: Zero-knowledge identity verification
- 📱 **Mobile & Desktop**: QR code scanning and deep linking support
- 🔐 **Secure**: End-to-end encrypted verification process
- ⚡ **Fast**: Quick verification with real-time status updates
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── verify/
│   │       └── route.ts          # Backend verification API
│   └── verify/
│       └── page.tsx              # Main verification page
├── components/
│   └── verification/
│       ├── index.ts              # Component exports
│       ├── self-verification-qr.tsx    # QR code component
│       └── verification-status-card.tsx # Status display component
└── .env.local                    # Environment configuration
```

## Quick Start

### 1. Dependencies

The following packages are already installed:
- `@selfxyz/qrcode` - QR code generation and display
- `@selfxyz/core` - Core utilities and verification
- `ethers` - Ethereum utilities

### 2. Environment Variables

Update `.env.local` with your configuration:

```env
# Self.xyz Configuration
NEXT_PUBLIC_SELF_APP_NAME="Your App Name"
NEXT_PUBLIC_SELF_SCOPE="your-app-scope"
NEXT_PUBLIC_SELF_ENDPOINT="https://your-domain.com"

# Self.xyz Backend Configuration
SELF_SCOPE="your-app-scope"
SELF_ENDPOINT="https://your-domain.com/api/verify"
```

### 3. Access the Verification Page

Navigate to `/verify` in your application to access the identity verification interface.

## How It Works

### Frontend Flow

1. **QR Code Generation**: The `SelfVerificationQR` component generates a QR code containing verification requirements
2. **User Scanning**: Users scan the QR code with the Self mobile app
3. **Proof Generation**: The Self app generates a zero-knowledge proof locally
4. **Status Updates**: Real-time status updates show verification progress

### Backend Flow

1. **Receive Proof**: The `/api/verify` endpoint receives the zero-knowledge proof
2. **Verification**: The `SelfBackendVerifier` validates the proof against requirements
3. **Response**: Returns verification result with disclosed attributes (age, nationality, etc.)

## Configuration Options

### Verification Requirements

You can customize what information to verify:

```typescript
disclosures: {
  minimumAge: 18,              // Minimum age requirement
  nationality: true,           // Require nationality verification
  gender: true,                // Require gender verification
  excludedCountries: ["IRN", "PRK", "RUS", "SYR"], // Excluded countries
  ofac: true,                  // OFAC sanctions check
}
```

### Supported Document Types

- **Passport** (attestationId: 1)
- **EU ID Card** (attestationId: 2)
- **Aadhaar** (attestationId: 3)

## Components

### SelfVerificationQR

Reusable QR code component for identity verification:

```typescript
<SelfVerificationQR
  appName="Your App Name"
  scope="your-app-scope"
  disclosures={{
    minimumAge: 18,
    nationality: true,
    gender: true,
  }}
  onSuccess={() => console.log("Verified!")}
  onError={(error) => console.error(error)}
/>
```

### VerificationStatusCard

Status display component with real-time updates:

```typescript
<VerificationStatusCard
  status={verificationStatus}
  result={verificationResult}
  error={error}
  onReset={() => resetVerification()}
/>
```

## API Reference

### POST /api/verify

Verifies zero-knowledge proofs submitted by the Self app.

**Request Body:**
```json
{
  "attestationId": 1,           // Document type
  "proof": "...",               // Zero-knowledge proof
  "publicSignals": [...],       // Public signals array
  "userContextData": "0x..."    // User context (hex string)
}
```

**Response (Success):**
```json
{
  "status": "success",
  "result": true,
  "message": "Identity verification successful",
  "credentialSubject": {
    "nationality": "USA",
    "gender": "M",
    "minimumAge": 18
  },
  "verificationDetails": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "attestationId": 1,
    "isValid": true
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "result": false,
  "reason": "Verification failed",
  "error_code": "VERIFICATION_FAILED"
}
```

## Security Considerations

### Environment Setup

- **Development**: Uses staging endpoints and mock verification
- **Production**: Configure production endpoints and real verification

### CORS Configuration

The API includes CORS headers for cross-origin requests. Adjust as needed for your domain.

### Error Handling

- Comprehensive error handling for network, verification, and system errors
- User-friendly error messages without exposing sensitive information
- Detailed logging for debugging (remove in production)

## Deployment Notes

### Production Checklist

1. **Update Environment Variables**: Set production endpoints
2. **SSL Certificate**: Ensure HTTPS is configured
3. **Domain Configuration**: Update CORS and endpoint URLs
4. **Error Logging**: Configure proper error logging service
5. **Performance**: Consider caching strategies for verification results

### Ngrok for Local Development

For local development, use ngrok to expose your localhost:

```bash
ngrok http 3000
```

Update your `.env.local` with the ngrok URL:

```env
NEXT_PUBLIC_SELF_ENDPOINT="https://your-ngrok-url.ngrok.io"
SELF_ENDPOINT="https://your-ngrok-url.ngrok.io/api/verify"
```

## Troubleshooting

### Common Issues

1. **QR Code Not Loading**: Check environment variables and network connectivity
2. **Verification Fails**: Ensure backend configuration matches frontend requirements
3. **CORS Errors**: Verify domain configuration and CORS headers
4. **Mobile App Issues**: Check deep linking and QR code generation

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

This will provide detailed console logs for troubleshooting.

## Support

For Self.xyz related issues:
- [Self.xyz Documentation](https://docs.self.xyz/)
- [Self.xyz GitHub](https://github.com/selfxyz/self)
- [ETHGlobal Workshop Video](https://www.youtube.com/watch?v=2g0F5dWrUKk)

## License

This implementation follows the same license as your main project.