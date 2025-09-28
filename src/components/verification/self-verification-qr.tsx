'use client';

import React, { useState, useEffect } from 'react';
// import { getUniversalLink } from "@selfxyz/core";
// import {
//   SelfQRcodeWrapper,
//   SelfAppBuilder,
//   type SelfApp,
// } from "@selfxyz/qrcode";
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
    excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
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
    // Temporarily disabled - Self dependencies not available
    setLoading(false);
    setError("Self verification temporarily unavailable");
  }, []);

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
        <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
          <div className="text-center space-y-2">
            <QrCode className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">Self verification temporarily unavailable</p>
            <p className="text-xs text-gray-500">Dependencies need to be installed</p>
          </div>
        </div>
      </div>
    </div>
  );
}