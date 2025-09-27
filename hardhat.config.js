require("@nomicfoundation/hardhat-toolbox");
require("@kadena/hardhat-chainweb");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // Kadena EVM Testnet Chain 20
    kadenaEVMTestnet: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
      chainId: 5920,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // Kadena EVM Testnet Chain 21
    kadenaEVMTestnet21: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc",
      chainId: 5921,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // Kadena EVM Testnet Chain 22
    kadenaEVMTestnet22: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc",
      chainId: 5922,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  },
  // Kadena Chainweb configuration for multi-chain deployment
  kadenaChainweb: {
    network: "evm-testnet",
    chains: [20, 21, 22], // EVM chains we want to deploy to
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