# Dice.fun - Decentralized Live Streaming Platform

A professional live streaming platform built on Kadena EVM with blockchain-based tipping and donation functionality. Dice.fun enables creators to monetize their content through secure, transparent cryptocurrency transactions.

## 🚀 Features

- **Decentralized Streaming**: Built on Kadena blockchain for true ownership and censorship resistance
- **Crypto Tipping**: Secure tipping system with DiceTipping smart contract
- **Multi-chain Support**: Deployed on Kadena EVM Chain 20 (Chain ID: 5920)
- **Wallet Integration**: WalletConnect support for seamless crypto transactions
- **Professional UI**: Modern, responsive design built with Next.js and Tailwind CSS
- **Live Chat**: Real-time interaction between streamers and viewers
- **Enterprise Grade**: Professional quality streaming with blockchain verification

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **WalletConnect** - Wallet integration
- **HLS.js** - HTTP Live Streaming support

### Backend & Blockchain
- **Kadena EVM** - Blockchain platform (Chain ID: 5920)
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **Foundry** - Smart contract testing and deployment
- **OpenZeppelin** - Secure contract standards
- **Ethers.js** - Ethereum library

## 📋 Smart Contract

### DiceTipping Contract
The core tipping functionality is implemented through the `DiceTipping` smart contract:

**Contract Address**: `0x2a2F8E4FA8eBa6271982eCf0309ec98996e509C5`

**Network**: Kadena EVM Testnet (Chain ID: 5920)

**Features**:
- Secure tipping between users
- Stream-specific tipping functionality
- Donation system with customizable purposes
- Platform fee management
- Reentrancy protection
- Pausable functionality
- Ownership controls

**Deployment Details**:
- Transaction Hash: `0x5e17d8ecd3a53885e543722a1690f16c4f81b665e29b4bcbf82fd367b2ecf393`
- Block: 247645
- Gas Used: 4278637 gas
- Cost: 0.004278637029950459 ETH

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- MetaMask or compatible wallet
- Kadena EVM testnet KDA for testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/dice-fun.git
cd dice-fun
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_KADENA_EVM_RPC_URL=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Smart Contract Development

### Compile Contracts
```bash
npm run compile
```

### Deploy to Kadena EVM
```bash
# Deploy to Chain 20
npm run deploy:kadena

# Deploy to Chain 21
npm run deploy:kadena21

# Deploy to Chain 22
npm run deploy:kadena22
```

### Verify Contract
```bash
npm run contract:verify --network kadenaEVMTestnet
```

### Using Foundry
```bash
# Foundry is set up for advanced testing and deployment
cd foundry
forge test
forge script script/Deploy.sol --broadcast
```

## 📱 Key Pages

- **Home** (`/`) - Landing page with featured streams
- **Browse** (`/browse`) - Discover live streams
- **Dashboard** (`/dashboard`) - User dashboard and stream management
- **Profile** (`/profile`) - User profile and settings
- **Stream** (`/stream/[id]`) - Individual stream page with chat
- **Admin** (`/admin`) - Administrative functions

## 🎯 Core Components

### Streaming Components
- `HLSVideoPlayer` - Video player with HLS support
- `LiveStreams` - Live stream listing
- `StreamCard` - Stream preview card
- `Chat` - Real-time chat functionality

### Wallet Integration
- `WalletConnectManager` - Wallet connection management
- `TipDialog` - Tipping interface
- Integration with multiple wallet providers

### UI Components
- Custom UI components built with Radix UI
- Responsive design for all devices
- Dark/light theme support

## 🔐 Security Features

- **ReentrancyGuard** - Prevents reentrancy attacks
- **Ownable** - Ownership controls for critical functions
- **Pausable** - Emergency pause functionality
- **Input Validation** - Comprehensive validation for all inputs
- **Secure Randomness** - For generating unique tip/donation IDs

## 🌐 Network Configuration

### Kadena EVM Testnet
- **Chain ID**: 5920
- **RPC URL**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
- **Block Explorer**: `http://chain-20.evm-testnet-blockscout.chainweb.com`
- **Currency**: KDA

### Contract Addresses
- **DiceTipping**: `0x2a2F8E4FA8eBa6271982eCf0309ec98996e509C5`

## 📝 Scripts

### Deployment Scripts
- `scripts/deploy.js` - Hardhat deployment script
- `foundry/script/Deploy.s.sol` - Foundry deployment script

### Build Scripts
- `npm run build` - Build the Next.js application
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Block Explorer**: [View Contract on Blockscout](http://chain-20.evm-testnet-blockscout.chainweb.com/address/0x2a2F8E4FA8eBa6271982eCf0309ec98996e509C5)
- **Transaction**: [View Deployment Transaction](http://chain-20.evm-testnet-blockscout.chainweb.com/tx/0x5e17d8ecd3a53885e543722a1690f16c4f81b665e29b4bcbf82fd367b2ecf393)
- **Kadena Faucet**: [Get Test KDA](https://faucet.evm-testnet.chainweb.com/)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Join our community discussions
- Check the documentation in the `/docs` folder

---

Built with ❤️ for the decentralized streaming community
