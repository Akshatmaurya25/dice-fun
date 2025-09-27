"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { KadenaService, KADENA_CONFIG } from '@/lib/kadena-client'

// Temporary config until Kadena client is working
const KADENA_CONFIG = {
  networkId: 'testnet04',
  chainId: '1',
  host: 'https://api.testnet.chainweb.com',
  gasLimit: 150000,
  gasPrice: 0.00000001,
  ttl: 600
}

export function ContractDeployment() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle')
  const [contractDeployed, setContractDeployed] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<string>('')
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')

  // const kadenaService = KadenaService.getInstance()

  useEffect(() => {
    checkContractStatus()
  }, [])

  const checkContractStatus = async () => {
    // Temporarily set to false until we fix the Kadena client
    setContractDeployed(false)
    // const deployed = await kadenaService.checkContractStatus()
    // setContractDeployed(deployed)
  }

  const generateKeypair = () => {
    // Generate a random keypair for testing
    const randomHex = (length: number) => {
      const chars = '0123456789abcdef'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
      return result
    }

    const pubKey = randomHex(64)
    const secKey = randomHex(64)

    setPublicKey(pubKey)
    setSecretKey(secKey)
  }

  const deployContract = async () => {
    if (!publicKey || !secretKey) {
      alert('Please provide a keypair or generate one')
      return
    }

    try {
      setIsDeploying(true)
      setDeploymentStatus('deploying')

      // Simple contract code
      const contractCode = `(namespace "free")

(module dice-tipping GOVERNANCE
  "Dice.fun Simple Tipping Contract"

  (defcap GOVERNANCE ()
    "Only governance can update this contract"
    (enforce-guard (keyset-ref-guard "dice-tipping-admin")))

  (defcap TIP (from:string to:string amount:decimal)
    "Capability for tipping operations"
    (enforce (> amount 0.0) "Tip amount must be positive")
    (enforce (!= from to) "Cannot tip yourself")
    (enforce-guard (at 'guard (coin.details from))))

  (defschema tip-record
    from:string
    to:string
    amount:decimal
    timestamp:time
    message:string)

  (deftable tips:{tip-record})

  (defun tip (from:string to:string amount:decimal message:string)
    "Send a tip from one user to another"
    (with-capability (TIP from to amount)
      (let ((tip-id (hash [from to amount (at 'block-time (chain-data))])))
        (coin.transfer from to amount)
        (insert tips tip-id {
          "from": from,
          "to": to,
          "amount": amount,
          "timestamp": (at 'block-time (chain-data)),
          "message": message
        })
        tip-id)))

  (defun get-tips ()
    "Get all tips"
    (select tips (constantly true)))
)

(create-table tips)`

      // Generate comprehensive deployment instructions
      const instructions = `🚀 KADENA CONTRACT DEPLOYMENT INSTRUCTIONS

📋 Contract Details:
- Name: free.dice-tipping
- Network: ${KADENA_CONFIG.networkId}
- Chain: ${KADENA_CONFIG.chainId}
- Host: ${KADENA_CONFIG.host}

🔑 Admin Keypair:
- Public Key: ${publicKey}
- Account: k:${publicKey}
- Secret Key: ${secretKey}

💰 STEP 1: Fund the Admin Account
1. Visit: https://faucet.testnet.chainweb.com/
2. Enter account: k:${publicKey}
3. Select Chain ID: ${KADENA_CONFIG.chainId}
4. Request testnet KDA (you need at least 1 KDA)

📝 STEP 2: Deploy the Contract
METHOD A - Using Kadena CLI:
1. Install: npm install -g @kadena/kadena-cli
2. Save contract code to: dice-tipping.pact
3. Deploy: kadena deploy --file=dice-tipping.pact --network=testnet

METHOD B - Using Chainweaver:
1. Download: https://www.kadena.io/chainweaver
2. Import your keypair, switch to testnet
3. Use Deploy tab to deploy the contract

🧪 Testing:
After deployment, test with:
(free.dice-tipping.tip "sender" "receiver" 1.0 "Hello!")

📚 CONTRACT CODE:
${contractCode}`

      setDeploymentResult(instructions)
      setDeploymentStatus('success')

    } catch (error) {
      console.error('Deployment failed:', error)
      setDeploymentResult(`Deployment failed: ${error}`)
      setDeploymentStatus('error')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kadena Smart Contract Deployment</CardTitle>
          <CardDescription>
            Deploy the Dice.fun tipping contract to Kadena testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Contract Status:</span>
            <Badge variant={contractDeployed ? "default" : "secondary"}>
              {contractDeployed ? "✅ Deployed" : "❌ Not Deployed"}
            </Badge>
          </div>

          {/* Network Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <span className="font-medium">Network:</span> {KADENA_CONFIG.networkId}
            </div>
            <div>
              <span className="font-medium">Chain:</span> {KADENA_CONFIG.chainId}
            </div>
            <div>
              <span className="font-medium">Host:</span> {KADENA_CONFIG.host}
            </div>
            <div>
              <span className="font-medium">Gas Limit:</span> {KADENA_CONFIG.gasLimit}
            </div>
          </div>

          {!contractDeployed && (
            <>
              {/* Keypair Generation */}
              <div className="space-y-2">
                <h3 className="font-medium">Admin Keypair</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Public Key:</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                      placeholder="Public key for admin account"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Secret Key:</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Secret key for admin account"
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={generateKeypair}>
                  Generate Random Keypair
                </Button>
                {publicKey && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="text-sm">
                      Admin Account: <code className="bg-gray-100 px-1 rounded">k:{publicKey}</code>
                      <br />
                      ⚠️ Make sure to fund this account with testnet KDA before deployment!
                      <br />
                      Visit: <a href="https://faucet.testnet.chainweb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        https://faucet.testnet.chainweb.com/
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Deploy Button */}
              <Button
                onClick={deployContract}
                disabled={isDeploying || !publicKey || !secretKey}
                className="w-full"
              >
                {isDeploying ? "Preparing Deployment..." : "Prepare Contract Deployment"}
              </Button>
            </>
          )}

          {/* Deployment Result */}
          {deploymentResult && (
            <div className="space-y-2">
              <h3 className="font-medium">Deployment Instructions</h3>
              <textarea
                value={deploymentResult}
                readOnly
                className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
              />
            </div>
          )}

          {/* Test Contract Functions */}
          {contractDeployed && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Test Contract Functions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => alert('Contract testing will be available after deployment')}>
                  Test Get User Stats
                </Button>
                <Button variant="outline" onClick={() => alert('Contract testing will be available after deployment')}>
                  Test Get Recent Tips
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}