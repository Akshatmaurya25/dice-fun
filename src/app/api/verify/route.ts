import { NextResponse } from "next/server";
// import { SelfBackendVerifier, AllIds, DefaultConfigStore } from "@selfxyz/core";

// Reuse a single verifier instance
const selfBackendVerifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE || "dice-fun-app",
  process.env.SELF_ENDPOINT || "https://tentaculoid-nonservilely-elenora.ngrok-free.dev/api/verify",
  process.env.NODE_ENV !== "production", // mockPassport: true for development, false for production
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: ["CUB", "IRN", "PRK", "RUS"], // Must match frontend exactly
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
          status: "error",
          result: false,
          reason: "Proof, publicSignals, attestationId and userContextData are required",
          error_code: "MISSING_REQUIRED_FIELDS"
        },
        { status: 200 } // Self.xyz requires 200 status code even for errors
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

    // Check if verification was successful - following Self.xyz documentation
    const { isValid, isMinimumAgeValid, isOfacValid } = result.isValidDetails;
    
    if (!isValid || !isMinimumAgeValid || isOfacValid) {
      let reason = "Verification failed";
      if (!isMinimumAgeValid) reason = "Minimum age verification failed";
      if (isOfacValid) reason = "OFAC verification failed"; // Note: isOfacValid = true means FAILED
      
      return NextResponse.json(
        {
          status: "error",
          result: false,
          reason,
          error_code: "VERIFICATION_FAILED",
          details: result.isValidDetails,
        },
        { status: 200 } // Self.xyz requires 200 status code even for failures
      );
    }

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
      },
      userData: result.userData
    });
  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: error instanceof Error ? error.message : "Unknown error occurred",
        error_code: "VERIFICATION_ERROR"
      },
      { status: 200 } // Self.xyz requires 200 status code even for errors
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
      'Access-Control-Allow-Headers': 'Content-Type, ngrok-skip-browser-warning',
    },
  });
}

// Handle GET request for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Self.xyz verification endpoint is running",
    timestamp: new Date().toISOString()
  });
}