'use client';

import React, { useState, useEffect } from 'react';
import { getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
  countries,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, QrCode } from "lucide-react";

interface SelfVerificationQRProps {
  userId?: string;
  appName?: string;
  scope?: string;
  endpoint?: string;
  userDefinedData?: string;
  disclosures?: Record<string, unknown>;
  onSuccess?: () => void;
  onError?: (error: Error | unknown) => void;
  className?: string;
}

export function SelfVerificationQR({
  userId = ethers.ZeroAddress,
  appName = "Self Identity Verification",
  scope = "self-app",
  endpoint,
  userDefinedData = "Identity Verification",
  
  disclosures = {
    minimumAge: 18,
    nationality: true,
    gender: true,
    excludedCountries: [countries.CUBA, countries.IRAN, countries.NORTH_KOREA, countries.RUSSIA],
    ofac: true,
  },
  onSuccess,
  onError,
  className = ""
}: SelfVerificationQRProps) {
  const [selfApp, setSelfApp] = useState<any>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSelfApp = async () => {
      try {
        setLoading(true);
        setError(null);

        const verificationEndpoint = endpoint || 
          `${process.env.NEXT_PUBLIC_SELF_ENDPOINT || window.location.origin}/api/verify`;

        console.log("Self.xyz config:", {
          endpoint: verificationEndpoint,
          NEXT_PUBLIC_SELF_ENDPOINT: process.env.NEXT_PUBLIC_SELF_ENDPOINT,
          windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'undefined'
        });

        // Validate that we're not using localhost
        if (verificationEndpoint.includes('localhost') || verificationEndpoint.includes('127.0.0.1')) {
          throw new Error('Self.xyz requires a public HTTPS endpoint. Please use ngrok or deploy to a staging environment. See SELF_INTEGRATION.md for setup instructions.');
        }

        const app = new SelfAppBuilder({
          version: 2,
          appName,
          scope,
          endpoint: verificationEndpoint,
          logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
          userId,
          endpointType: "staging_https", // Use "staging_https" for ngrok/custom HTTPS endpoints
          userIdType: "hex",
          userDefinedData,
          disclosures,
        }).build();

        setSelfApp(app);
        setUniversalLink(getUniversalLink(app));
      } catch (err) {
        console.error("Failed to initialize Self app:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize verification";
        setError(errorMessage);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    initializeSelfApp();
  }, [userId, appName, scope, endpoint, userDefinedData, disclosures, onError]);

  const handleSuccess = () => {
    console.log("Self verification successful");
    onSuccess?.();
  };

  const handleError = (error: Error | unknown) => {
    console.error("Self verification error:", error);
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    setError(errorMessage);
    onError?.(error);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
          <p className="text-sm text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center w-64 h-64 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="text-center space-y-2 p-4">
          <QrCode className="h-8 w-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-600">Failed to load verification</p>
          <p className="text-xs text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!selfApp) {
    return (
      <div className={`flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center space-y-2">
          <QrCode className="h-8 w-8 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-600">Verification not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="w-full max-w-sm mx-auto">
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={handleSuccess}
          onError={(data: { error_code?: string; reason?: string }) => {
            const errorMsg = data.error_code || data.reason || "Verification failed";
            console.log('REASON:', data.reason);
            console.error("Self verification error:", errorMsg);
            setError(errorMsg);
            onError?.(errorMsg);
          }}
        />
      </div>
      
      {universalLink && (
        <div className="w-full space-y-2">
          <p className="text-sm text-gray-600 text-center">
            Or open directly in the Self app:
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(universalLink, '_blank')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Open in Self App
          </Button>
        </div>
      )}
    </div>
  );
}