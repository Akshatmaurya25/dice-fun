# Kadena EVM Smart Contract Deployment Guide

## 🚀 Overview

This guide shows how to deploy Solidity smart contracts to Kadena's EVM-compatible chains (20-24) for the Dice.fun tipping system.

## 📋 Prerequisites

1. **MetaMask or EVM-compatible wallet**
2. **Node.js** (v16 or later)
3. **Testnet KDA tokens**

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @kadena/hardhat-chainweb @nomicfoundation/hardhat-toolbox

# Install OpenZeppelin for secure contracts
npm install @openzeppelin/contracts

# Install ethers for blockchain interaction
npm install ethers
```

### 2. Configure Environment

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your private key (NO 0x prefix)

### 3. Add Kadena EVM Network to MetaMask

**Network Details:**
- **Network Name:** Kadena Chainweb EVM Testnet 20
- **RPC URL:** `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
- **Chain ID:** `5920`
- **Currency Symbol:** `KDA`
- **Block Explorer:** `http://chain-20.evm-testnet-blockscout.chainweb.com`

### 4. Fund Your Account

1. Visit: https://faucet.evm-testnet.chainweb.com/
2. Enter your wallet address
3. Request testnet KDA tokens

## 📦 Smart Contract Features

Our **DiceTipping** contract includes:

✅ **Regular Tipping:** Send tips with messages
✅ **Stream Tipping:** Tip specific streams with tracking
✅ **Donations:** Purpose-based donations
✅ **User Statistics:** Track all tipping activity
✅ **Platform Fees:** 2.5% fee collection
✅ **Security:** ReentrancyGuard, Pausable, Admin controls
✅ **Events:** Comprehensive logging for frontend integration

## 🚀 Deployment Commands

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Kadena EVM Testnet
```bash
# Deploy to Chain 20
npm run deploy:kadena

# Deploy to Chain 21
npm run deploy:kadena21

# Deploy to Chain 22
npm run deploy:kadena22
```

### Manual Deployment
```bash
npx hardhat run scripts/deploy.js --network kadenaEVMTestnet
```

## 🔗 Frontend Integration

### 1. Configure Contract Address

After deployment, update your frontend:

```typescript
import { useKadenaEVM } from '@/hooks/useKadenaEVM'

const { setContractAddress } = useKadenaEVM()

// Set your deployed contract address
setContractAddress('0x...')
```

### 2. Use Tipping Functions

```typescript
const { sendTip, sendStreamTip, makeDonation } = useKadenaEVM()

// Send a regular tip
await sendTip(recipientAddress, '0.1', 'Great content!')

// Send a stream tip
await sendStreamTip(streamerAddress, streamId, '0.05', 'Love the stream!')

// Make a donation
await makeDonation(recipientAddress, '1.0', 'Development', 'Keep building!')
```

### 3. Get User Statistics

```typescript
const { getUserStats } = useKadenaEVM()

const stats = await getUserStats(userAddress)
// Returns: totalTipsSent, totalTipsReceived, tipCount, etc.
```

## 🧪 Testing

### Contract Functions
```solidity
// Send tip
contract.sendTip(recipient, message, {value: ethers.utils.parseEther("0.1")})

// Stream tip
contract.sendStreamTip(streamer, streamId, message, {value: ethers.utils.parseEther("0.05")})

// Donation
contract.makeDonation(recipient, purpose, message, {value: ethers.utils.parseEther("1.0")})
```

### View Functions
```solidity
// Get user stats
contract.getUserStats(userAddress)

// Get stream tip count
contract.getStreamTipCount(streamId)

// Get recent tips
contract.getRecentTips(10)
```

## 📊 Admin Panel

Visit `/admin` in your application to:

1. **Connect MetaMask** to Kadena EVM
2. **Switch Networks** automatically
3. **Generate Deployment Instructions**
4. **Configure Contract Address**
5. **Monitor Contract Status**
6. **Access Quick Links** (faucet, explorer)

## 🔍 Block Explorers

- **Chain 20:** http://chain-20.evm-testnet-blockscout.chainweb.com
- **Chain 21:** http://chain-21.evm-testnet-blockscout.chainweb.com
- **Chain 22:** http://chain-22.evm-testnet-blockscout.chainweb.com

## 💡 Best Practices

1. **Test First:** Always test on testnet before mainnet
2. **Verify Contracts:** Use block explorer verification
3. **Monitor Gas:** Kadena EVM has low fees, but monitor usage
4. **Security:** Keep private keys secure
5. **Backup:** Save deployment addresses and transaction hashes

## 🆘 Troubleshooting

### Common Issues:

1. **"Insufficient funds"**
   - Get more testnet KDA from faucet
   - Check you're on correct network

2. **"Wrong network"**
   - Switch to Kadena EVM in MetaMask
   - Verify Chain ID (5920)

3. **"Contract not found"**
   - Verify contract address is correct
   - Ensure contract is deployed

4. **"Transaction failed"**
   - Check gas limits
   - Verify recipient address
   - Ensure sufficient balance

## 📞 Support

- **Kadena Discord:** https://discord.gg/kadena
- **Documentation:** https://docs.kadena.io/
- **EVM Faucet:** https://faucet.evm-testnet.chainweb.com/

## 🎯 Next Steps

1. Deploy contract using the admin panel
2. Test all functions thoroughly
3. Integrate with your streaming interface
4. Monitor usage and optimize
5. Consider mainnet deployment when ready

---

*Happy building on Kadena EVM! 🚀*