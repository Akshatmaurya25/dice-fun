import { NextResponse } from "next/server";
import { SelfBackendVerifier, AllIds, DefaultConfigStore } from "@selfxyz/core";

// Reuse a single verifier instance
const selfBackendVerifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE || "dice-fun-app",
  process.env.SELF_ENDPOINT || "https://dice-fun.vercel.app/api/verify",
  process.env.NODE_ENV !== "production", // mockPassport: true for development, false for production
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
    ofac: true,
  }),
  "hex" // userIdentifierType - matching frontend configuration
);

export async function POST(req: Request) {
  try {
    // Extract data from the request
    const { attestationId, proof, publicSignals, userContextData } = await req.json();

    // Log the request for debugging (remove in production)
    console.log("Verification request received:", {
      attestationId,
      hasProof: !!proof,
      hasPublicSignals: !!publicSignals,
      hasUserContextData: !!userContextData,
    });

    // Verify all required fields are present
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json(
        {
          message: "Proof, publicSignals, attestationId and userContextData are required",
          status: "error",
          result: false,
          error_code: "MISSING_REQUIRED_FIELDS"
        },
        { status: 400 }
      );
    }

    // Verify the proof
    const result = await selfBackendVerifier.verify(
      attestationId,    // Document type (1 = passport, 2 = EU ID card, 3 = Aadhaar)
      proof,            // The zero-knowledge proof
      publicSignals,    // Public signals array
      userContextData   // User context data (hex string)
    );

    // Log verification result for debugging
    console.log("Verification result:", {
      isValid: result.isValidDetails.isValid,
      details: result.isValidDetails,
    });

    // Check if verification was successful
    if (result.isValidDetails.isValid) {
      // Verification successful - process the result
      return NextResponse.json({
        status: "success",
        result: true,
        message: "Identity verification successful",
        credentialSubject: result.discloseOutput,
        verificationDetails: {
          timestamp: new Date().toISOString(),
          attestationId,
          isValid: true,
        }
      });
    } else {
      // Verification failed
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason: "Verification failed",
          error_code: "VERIFICATION_FAILED",
          details: result.isValidDetails,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    
    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: error instanceof Error ? error.message : "Unknown error occurred",
        error_code: "VERIFICATION_ERROR"
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}