'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, QrCode } from "lucide-react";
import { countries } from "@selfxyz/qrcode";
import { 
  SelfVerificationQR, 
  VerificationStatusCard, 
  type VerificationStatus,
  type VerificationResult
} from "@/components/verification";
import { APITest } from "@/components/test/api-test";

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccessfulVerification = () => {
    console.log("Verification successful!");
    setVerificationStatus('success');
    setError(null);
    // In a real implementation, you might want to fetch the verification result from your API
  };

  const handleVerificationError = (error: Error | unknown) => {
    console.error("Verification error:", error);
    setVerificationStatus('error');
    const errorMessage = error instanceof Error ? error.message : "Verification failed. Please try again.";
    setError(errorMessage);
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Identity Verification</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure your account with Self Protocol&apos;s zero-knowledge identity verification
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Scan QR Code
              </CardTitle>
              <CardDescription>
                Use the Self app to scan this QR code and complete your identity verification
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
                <div className="text-center space-y-2">
                  <QrCode className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Verification temporarily disabled</p>
                  <p className="text-xs text-gray-500">Self dependencies need to be installed</p>
                </div>
              </div>
              {/* <SelfVerificationQR
                appName="Dice Fun - Identity Verification"
                scope="dice-fun-app"
                userDefinedData="Dice Fun Identity Verification"
                disclosures={{
                  minimumAge: 18,
                  nationality: true,
                  gender: true,
                  excludedCountries: [countries.CUBA, countries.IRAN, countries.NORTH_KOREA, countries.RUSSIA],
                  ofac: true,
                }}
                onSuccess={handleSuccessfulVerification}
                onError={handleVerificationError}
                className="w-full"
              /> */}
            </CardContent>
          </Card>

          {/* Status Section */}
          <VerificationStatusCard
            status={verificationStatus}
            result={verificationResult}
            error={error}
            onReset={resetVerification}
          />
        </div>

        {/* How it Works Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>How Identity Verification Works</CardTitle>
            <CardDescription>
              Your privacy is protected with zero-knowledge proofs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium">Scan QR Code</h3>
                <p className="text-sm text-gray-600">
                  Use the Self app to scan the QR code with your verified identity document
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-medium">Generate Proof</h3>
                <p className="text-sm text-gray-600">
                  Your device creates a zero-knowledge proof without revealing personal data
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-medium">Verify Identity</h3>
                <p className="text-sm text-gray-600">
                  Our system verifies your proof and grants access while protecting your privacy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug: API Test Component */}
        <div className="mt-8">
          <APITest />
        </div>
      </div>
    </div>
  );
}