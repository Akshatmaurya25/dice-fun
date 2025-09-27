"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKadenaEVM } from '@/hooks/useKadenaEVM'

export function KadenaEVMDeployment() {
  const [deploymentInstructions, setDeploymentInstructions] = useState('')
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false)

  const {
    isConnected,
    isLoading,
    address,
    balance,
    chainId,
    isKadenaNetwork,
    contractAddress,
    contractInfo,
    connect,
    switchToKadenaNetwork,
    setContractAddress,
    faucetUrl,
    blockExplorerUrl
  } = useKadenaEVM()

  const generateDeploymentInstructions = () => {
    setIsGeneratingInstructions(true)

    const instructions = `🚀 KADENA EVM SMART CONTRACT DEPLOYMENT

📋 Network Information:
- Network: Kadena Chainweb EVM Testnet
- Chain ID: 5920
- RPC URL: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
- Block Explorer: ${blockExplorerUrl}
- Faucet: ${faucetUrl}

💰 STEP 1: Fund Your Wallet
1. Add Kadena EVM network to MetaMask (click "Switch to Kadena Network" above)
2. Visit the faucet: ${faucetUrl}
3. Enter your address: ${address || 'Connect wallet first'}
4. Request testnet KDA tokens

📦 STEP 2: Deploy the Contract
Open terminal in your project directory and run:

# Install dependencies (if not already done)
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file and add your private key:
# PRIVATE_KEY=your_private_key_without_0x_prefix

# Compile the contract
npx hardhat compile

# Deploy to Kadena EVM Testnet
npx hardhat run scripts/deploy.js --network kadenaEVMTestnet

🔧 STEP 3: Configure Frontend
After deployment, update your frontend with the contract address:

const contractAddress = "0x..."; // Address from deployment
kadenaEVMService.setContractAddress(contractAddress);

📝 Contract Features:
✅ Regular tipping between users
✅ Stream-specific tipping with message
✅ Donations with purpose tracking
✅ User statistics and analytics
✅ Platform fee collection (2.5%)
✅ Multi-chain support (chains 20-24)
✅ Event logging for all transactions
✅ Admin controls and emergency functions

🧪 Testing:
After deployment, you can test:
- Send tips: contract.sendTip(recipient, message, {value: amount})
- Stream tips: contract.sendStreamTip(streamer, streamId, message, {value: amount})
- Donations: contract.makeDonation(recipient, purpose, message, {value: amount})

⚠️ Important Notes:
- This is testnet deployment - use test KDA only
- Keep your private key secure
- Smart contract is audited for basic security
- Platform fees go to contract owner
- Minimum tip/donation: 0.001 KDA`

    setDeploymentInstructions(instructions)
    setIsGeneratingInstructions(false)
  }

  const handleContractAddressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const address = formData.get('contractAddress') as string

    if (address && address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setContractAddress(address)
    } else {
      alert('Please enter a valid Ethereum address (0x...)')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kadena EVM Smart Contract Deployment</CardTitle>
          <CardDescription>
            Deploy Solidity contracts to Kadena's EVM-compatible chains (20-24)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Network Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Wallet Status</div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Network</div>
              <Badge variant={isKadenaNetwork ? "default" : "destructive"}>
                {isKadenaNetwork ? "Kadena EVM" : `Chain ${chainId || 'Unknown'}`}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Balance</div>
              <Badge variant="outline">
                {balance} KDA
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Contract</div>
              <Badge variant={contractAddress ? "default" : "secondary"}>
                {contractAddress ? "Set" : "Not Set"}
              </Badge>
            </div>
          </div>

          {/* Wallet Connection */}
          {!isConnected && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-gray-600 mb-3">
                Connect MetaMask to deploy and interact with contracts on Kadena EVM
              </p>
              <Button onClick={connect} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            </div>
          )}

          {/* Network Switch */}
          {isConnected && !isKadenaNetwork && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
              <h3 className="font-medium mb-2">Switch to Kadena Network</h3>
              <p className="text-sm text-gray-600 mb-3">
                You need to be on Kadena EVM network to deploy contracts
              </p>
              <Button onClick={switchToKadenaNetwork} disabled={isLoading}>
                {isLoading ? "Switching..." : "Switch to Kadena Network"}
              </Button>
            </div>
          )}

          {/* Account Info */}
          {isConnected && address && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium mb-2">Wallet Connected</h3>
              <div className="text-sm space-y-1">
                <div>Address: <code className="bg-gray-100 px-1 rounded">{address}</code></div>
                <div>Balance: {balance} KDA</div>
                <div>Network: Kadena EVM Chain {chainId === 5920 ? '20' : chainId}</div>
                {parseFloat(balance) < 0.1 && (
                  <div className="text-orange-600 mt-2">
                    Low balance! Get testnet KDA from: <a href={faucetUrl} target="_blank" rel="noopener noreferrer" className="underline">{faucetUrl}</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contract Address Configuration */}
          <div className="space-y-3">
            <h3 className="font-medium">Contract Configuration</h3>
            {contractAddress ? (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Current Contract</div>
                    <code className="text-sm bg-gray-100 px-1 rounded">{contractAddress}</code>
                  </div>
                  <Button variant="outline" onClick={() => setContractAddress('')}>
                    Change
                  </Button>
                </div>
                {contractInfo && (
                  <div className="mt-3 text-sm space-y-1">
                    <div>Platform Fee: {contractInfo.platformFeePercentage}%</div>
                    <div>Min Tip: {contractInfo.minimumTipAmount} KDA</div>
                    <div>Total Tips: {contractInfo.totalTips}</div>
                    <div>Total Donations: {contractInfo.totalDonations}</div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleContractAddressSubmit} className="flex gap-2">
                <input
                  name="contractAddress"
                  placeholder="Enter contract address (0x...)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  pattern="^0x[a-fA-F0-9]{40}$"
                  required
                />
                <Button type="submit">Set Contract</Button>
              </form>
            )}
          </div>

          {/* Deployment Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Deployment Instructions</h3>
              <Button
                variant="outline"
                onClick={generateDeploymentInstructions}
                disabled={isGeneratingInstructions}
              >
                {isGeneratingInstructions ? "Generating..." : "Generate Instructions"}
              </Button>
            </div>

            {deploymentInstructions && (
              <textarea
                value={deploymentInstructions}
                readOnly
                className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
              />
            )}
          </div>

          {/* Quick Actions */}
          {isConnected && isKadenaNetwork && (
            <div className="space-y-3">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(faucetUrl, '_blank')}
                >
                  Get Test KDA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(blockExplorerUrl, '_blank')}
                >
                  Block Explorer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`${blockExplorerUrl}/address/${contractAddress}`, '_blank')}
                  disabled={!contractAddress}
                >
                  View Contract
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`${blockExplorerUrl}/address/${address}`, '_blank')}
                  disabled={!address}
                >
                  View Wallet
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}