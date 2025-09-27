// Simple Kadena contract deployment script
// This can be run directly in a browser or Node.js environment

const TESTNET_CONFIG = {
  networkId: 'testnet04',
  chainId: '1',
  host: 'https://api.testnet.chainweb.com',
  gasLimit: 150000,
  gasPrice: 0.00000001,
  ttl: 600
}

// Generate a simple keypair for testing
function generateSimpleKeypair() {
  const randomHex = (length) => {
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }

  const publicKey = randomHex(64)
  const secretKey = randomHex(64)

  return {
    publicKey,
    secretKey,
    account: `k:${publicKey}`
  }
}

// Simple contract code for Kadena
const DICE_TIPPING_CONTRACT = `
(namespace "free")

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

(create-table tips)
`

// Create deployment instructions
function createDeploymentInstructions(keypair) {
  return `
🚀 KADENA CONTRACT DEPLOYMENT INSTRUCTIONS

📋 Contract Details:
- Name: free.dice-tipping
- Network: ${TESTNET_CONFIG.networkId}
- Chain: ${TESTNET_CONFIG.chainId}
- Host: ${TESTNET_CONFIG.host}

🔑 Admin Keypair:
- Public Key: ${keypair.publicKey}
- Account: ${keypair.account}
- Secret Key: ${keypair.secretKey}

💰 STEP 1: Fund the Admin Account
1. Visit: https://faucet.testnet.chainweb.com/
2. Enter account: ${keypair.account}
3. Select Chain ID: ${TESTNET_CONFIG.chainId}
4. Request testnet KDA (you need at least 1 KDA for deployment)

📝 STEP 2: Deploy the Contract
You can use any of these methods:

METHOD A - Using Kadena CLI:
1. Install Kadena CLI: npm install -g @kadena/kadena-cli
2. Save the contract code to: dice-tipping.pact
3. Run: kadena account fund --account="${keypair.account}" --amount=1.0 --network=testnet
4. Run: kadena deploy --file=dice-tipping.pact --network=testnet --chain-id=${TESTNET_CONFIG.chainId}

METHOD B - Using Chainweaver Wallet:
1. Download Chainweaver from: https://www.kadena.io/chainweaver
2. Import your keypair
3. Switch to testnet
4. Use the "Deploy" tab to deploy the contract

METHOD C - Manual API Call:
Use the Pact API endpoint: ${TESTNET_CONFIG.host}/chainweb/0.0/${TESTNET_CONFIG.networkId}/chain/${TESTNET_CONFIG.chainId}/pact/api/v1/send

⚠️ IMPORTANT NOTES:
- Keep your secret key secure and private
- This is a testnet deployment - don't use real funds
- Make sure your account has sufficient KDA before deploying
- The deployment can take a few minutes to confirm

🧪 TESTING:
After deployment, you can test the contract by calling:
(free.dice-tipping.tip "sender-account" "receiver-account" 1.0 "Hello!")

📚 CONTRACT CODE:
${DICE_TIPPING_CONTRACT}
`
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.KadenaDeployment = {
    generateSimpleKeypair,
    createDeploymentInstructions,
    TESTNET_CONFIG,
    DICE_TIPPING_CONTRACT
  }
}

// Export for Node.js use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateSimpleKeypair,
    createDeploymentInstructions,
    TESTNET_CONFIG,
    DICE_TIPPING_CONTRACT
  }
}

console.log('Simple Kadena deployment helper loaded!')
console.log('Usage: generateSimpleKeypair() to create a new keypair')