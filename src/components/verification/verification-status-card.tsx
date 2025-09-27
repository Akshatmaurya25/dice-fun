'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react";

export type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CredentialSubject {
  nationality?: string;
  gender?: string;
  minimumAge?: number;
  [key: string]: unknown;
}

export interface VerificationDetails {
  timestamp: string;
  attestationId: string | number;
  isValid: boolean;
  [key: string]: unknown;
}

export interface VerificationResult {
  status: 'success' | 'error';
  result: boolean;
  message?: string;
  credentialSubject?: CredentialSubject;
  verificationDetails?: VerificationDetails;
  reason?: string;
  error_code?: string;
}

interface VerificationStatusCardProps {
  status: VerificationStatus;
  result?: VerificationResult | null;
  error?: string | null;
  onReset?: () => void;
  className?: string;
}

export function VerificationStatusCard({
  status,
  result,
  error,
  onReset,
  className = ""
}: VerificationStatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Shield className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return "Verifying your identity...";
      case 'success':
        return "Identity verification successful!";
      case 'error':
        return error || "Verification failed";
      default:
        return "Ready to verify your identity";
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      case 'loading':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStatusIcon()}
          <span className="ml-3">Verification Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge 
            variant={getBadgeVariant()}
            className="text-sm py-1 px-3"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {getStatusMessage()}
          </p>
        </div>

        {result && status === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="ml-2">
              <h4 className="font-medium text-green-800">Verification Complete</h4>
              <div className="mt-2 text-sm text-green-700">
                {result.credentialSubject && (
                  <div className="space-y-1">
                    <p><strong>Age Verified:</strong> 18+</p>
                    {result.credentialSubject.nationality && (
                      <p><strong>Nationality:</strong> {String(result.credentialSubject.nationality)}</p>
                    )}
                    {result.credentialSubject.gender && (
                      <p><strong>Gender:</strong> {String(result.credentialSubject.gender)}</p>
                    )}
                    <p><strong>Verified:</strong> {new Date().toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        {error && status === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <div className="ml-2">
              <h4 className="font-medium text-red-800">Verification Failed</h4>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </Alert>
        )}

        {status !== 'idle' && onReset && (
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            Start New Verification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}