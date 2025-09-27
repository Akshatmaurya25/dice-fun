'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function APITest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const endpoint = process.env.NEXT_PUBLIC_SELF_ENDPOINT;
      console.log("Testing endpoint:", endpoint);
      
      const response = await fetch(`${endpoint}/api/verify`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log("Response text:", text);
      
      if (text.includes('<html>') || text.includes('ngrok')) {
        setResult(`❌ NGROK BROWSER WARNING DETECTED!\n\nResponse contains HTML instead of JSON:\n${text.substring(0, 200)}...`);
      } else {
        setResult(`✅ API Working! Response:\n${text}`);
      }
    } catch (error) {
      console.error("API test failed:", error);
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>API Endpoint Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAPI} disabled={loading}>
          {loading ? "Testing..." : "Test API Endpoint"}
        </Button>
        
        {result && (
          <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}