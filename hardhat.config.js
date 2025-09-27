require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
// require("@kadena/hardhat-chainweb");

// Helper function to ensure private key has 0x prefix
function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.startsWith('0x') ? key : `0x${key}`;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // Kadena EVM Testnet Chain 20
    kadenaEVMTestnet: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
      chainId: 5920,
      accounts: process.env.PRIVATE_KEY !== undefined ? [formatPrivateKey(process.env.PRIVATE_KEY)] : [],
    },
    // Kadena EVM Testnet Chain 21
    kadenaEVMTestnet21: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc",
      chainId: 5921,
      accounts: process.env.PRIVATE_KEY !== undefined ? [formatPrivateKey(process.env.PRIVATE_KEY)] : [],
    },
    // Kadena EVM Testnet Chain 22
    kadenaEVMTestnet22: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc",
      chainId: 5922,
      accounts: process.env.PRIVATE_KEY !== undefined ? [formatPrivateKey(process.env.PRIVATE_KEY)] : [],
    }
  },
  etherscan: {
    apiKey: {
      kadenaEVMTestnet: "no-api-key-needed", // Kadena doesn't require API key for verification
    },
    customChains: [
      {
        network: "kadenaEVMTestnet",
        chainId: 5920,
        urls: {
          apiURL: "http://chain-20.evm-testnet-blockscout.chainweb.com/api",
          browserURL: "http://chain-20.evm-testnet-blockscout.chainweb.com"
        }
      }
    ]
  }
};