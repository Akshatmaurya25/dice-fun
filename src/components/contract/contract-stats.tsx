"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDiceTipping } from '@/hooks/useDiceTipping';
import { formatEther } from 'ethers';

interface ContractInfo {
  platformFeePercentage: number;
  minimumTipAmount: string;
  minimumDonationAmount: string;
  totalTips: number;
  totalDonations: number;
}

export function ContractStats() {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const { getContractInfo, getUserStats, account, isConnected } = useDiceTipping();

  useEffect(() => {
    loadContractInfo();
  }, []);

  useEffect(() => {
    if (isConnected && account) {
      loadUserStats();
    }
  }, [isConnected, account]);

  const loadContractInfo = async () => {
    try {
      const info = await getContractInfo();
      if (info) {
        setContractInfo(info);
      }
    } catch (error) {
      console.error('Failed to load contract info:', error);
    }
  };

  const loadUserStats = async () => {
    if (!account) return;

    try {
      const stats = await getUserStats(account);
      if (stats) {
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  if (!contractInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading contract information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contract Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            DiceTipping Contract Stats
            <Badge variant="outline">Kadena EVM</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Tips</p>
              <p className="text-2xl font-bold">{contractInfo.totalTips}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Donations</p>
              <p className="text-2xl font-bold">{contractInfo.totalDonations}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Fee</p>
              <p className="text-2xl font-bold">{contractInfo.platformFeePercentage / 100}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Min Tip</p>
              <p className="text-2xl font-bold">{contractInfo.minimumTipAmount} KDA</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Stats (if connected) */}
      {isConnected && account && userStats && (
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tips Sent</p>
                <p className="text-xl font-bold">{Number(userStats.tipCount)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatEther(userStats.totalTipsSent)} KDA
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tips Received</p>
                <p className="text-xl font-bold">{Number(userStats.tipCount)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatEther(userStats.totalTipsReceived)} KDA
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Donations</p>
                <p className="text-xl font-bold">{Number(userStats.donationCount)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatEther(userStats.totalDonationsSent)} KDA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}