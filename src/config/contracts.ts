export const KADENA_EVM_NETWORKS = {
  testnet: {
    chainId: 5920,
    name: "Kadena EVM Testnet Chain 20",
    rpcUrl: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
    blockExplorer: "http://chain-20.evm-testnet-blockscout.chainweb.com",
    nativeCurrency: {
      name: "Kadena",
      symbol: "KDA",
      decimals: 18
    }
  },
  testnet21: {
    chainId: 5921,
    name: "Kadena EVM Testnet Chain 21",
    rpcUrl: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc",
    blockExplorer: "http://chain-21.evm-testnet-blockscout.chainweb.com",
    nativeCurrency: {
      name: "Kadena",
      symbol: "KDA",
      decimals: 18
    }
  },
  testnet22: {
    chainId: 5922,
    name: "Kadena EVM Testnet Chain 22",
    rpcUrl: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc",
    blockExplorer: "http://chain-22.evm-testnet-blockscout.chainweb.com",
    nativeCurrency: {
      name: "Kadena",
      symbol: "KDA",
      decimals: 18
    }
  }
};

export const CONTRACT_ADDRESSES = {
  DiceTipping: {
    testnet: process.env.NEXT_PUBLIC_DICE_TIPPING_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    testnet21: process.env.NEXT_PUBLIC_DICE_TIPPING_CONTRACT_ADDRESS_21 || "0x0000000000000000000000000000000000000000",
    testnet22: process.env.NEXT_PUBLIC_DICE_TIPPING_CONTRACT_ADDRESS_22 || "0x0000000000000000000000000000000000000000"
  }
};

export const DEFAULT_NETWORK = KADENA_EVM_NETWORKS.testnet;
export const DEFAULT_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.DiceTipping.testnet;

export const FAUCET_URL = "https://faucet.evm-testnet.chainweb.com/";