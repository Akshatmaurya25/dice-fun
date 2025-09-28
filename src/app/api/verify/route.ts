import { NextResponse } from "next/server";
// import { SelfBackendVerifier, AllIds, DefaultConfigStore } from "@selfxyz/core";

// Reuse a single verifier instance
// const selfBackendVerifier = new SelfBackendVerifier(
//   process.env.SELF_SCOPE || "dice-fun-app",
//   process.env.SELF_ENDPOINT || "https://dice-fun.vercel.app/api/verify",
//   process.env.NODE_ENV !== "production", // mockPassport: true for development, false for production
//   AllIds,
//   new DefaultConfigStore({
//     minimumAge: 18,
//     excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
//     ofac: true,
//   }),
//   "hex" // userIdentifierType - matching frontend configuration
// );

export async function POST(req: Request) {
  try {
    // Temporarily disabled while Self dependencies are not available
    return NextResponse.json(
      {
        status: "error",
        result: false,
        reason: "Verification service temporarily unavailable - Self dependencies need to be installed",
        error_code: "SERVICE_UNAVAILABLE"
      },
      { status: 503 }
    );
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