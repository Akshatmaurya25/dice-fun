Kadena Chainweb EVM deployment
If you are a smart contract developer who is used to building decentralized applications for Ethereum and EVM-compatible chains, deploying on the Kadena Chainweb EVM Testnet is largely the same as deploying on any other EVM-based chain.

At a high level, there are three basic steps:

Get an EVM-compatible wallet for your development account and fund it with test KDA from the Chainweb EVM Testnet faucet application.
Configure your development environment and wallet to use Chainweb EVM Testnet.
Deploy your application the way you would on any other chain.
This guide provides detailed instructions for each step. Because Hardhat is one of the most common development environment for Ethereum, this guide focuses on configuring and deploying Solidity smart contracts on Chainweb EVM Testnet using the Hardhat development environment and the @kadena/hardhat-chainweb plugin. Additional guides that focus on other development tools—such as Foundry and Remix—might be available separately, if there's sufficient interest from the broader community.

Get a wallet and tokens
Before you can deploy any smart contracts, you must have a wallet that supports EVM-compatible chains. You can add Kadena Chainweb EVM to any EVM-compatible wallet that supports adding custom networks. For example, you can add custom networks in MetaMask, Ledger, Trust Wallet, or Coinbase Wallet.

Note that wallets currently used for traditional Kadena development—such as Chainweaver, eckoWALLET, Enkrypt, Koala Wallet, or LinxWallet—only support Pact smart contracts at this time. Chainweb EVM Testnet supports Pact smart contracts on chains 0 through 19 and EVM-compatible smart contracts on chains 20 through 24. You must have an EVM-compatible wallet to interact with chains 20 through 24.

Add the Kadena network
Most EVM-compatible wallets provide an option to Add a custom network or a Connect to a custom network where you can specify details about the network you want to add or connect to. However, navigating to the network settings will vary depending on the specific wallet and version you use.

To add network settings to a MetaMask wallet:

Open the MetaMask extension in your browser.

Expand Ethereum Mainnet to display the list of networks:

Click Ethereum Mainnet to display the list of networks

Click Add a custom network at the bottom of the Enabled networks list.

Add the following network settings to add Kadena Chainweb EVM Testnet chain 20 to your wallet:

Network Name: Kadena Chainweb EVM Testnet 20
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Chain ID: 5920
Currency Symbol: KDA
Block Explorer URL: http://chain-20.evm-testnet-blockscout.chainweb.com
Alternatively, you can connect to an existing MetaMask wallet from Blockscout by clicking Add testnet@chain20.

Add to MetaMask from Blockscout

Note that navigating to network settings will depend on the EVM-compatible wallet you choose. For example, if you choose Coinbase Wallet, you must click Settings, then Networks before you have the option to Add or import a custom network. If you have trouble finding the option to connect to a custom network, consult the documentation for your specific wallet.

Fund the wallet account
After you connect your wallet account to Kadena Chainweb EVM Testnet chain 20, you need to fund the account with testnet KDA tokens to deploy contracts and pay transaction fees. Testnet KDA tokens have no monetary value but they are required to execute transactions on the network. In most cases, you can access the official Kadena EVM Faucet to fund your wallet account with enough KDA to deploy and interact with contracts on Chainweb EVM Testnet.

The funds provided by the official Kadena EVM Faucet should be sufficient for most testing scenarios. However, if the official faucet limits your ability to test because you are low on funds, contact the Kadena team to find out if there are other funding services or resources available.

To fund your wallet account using the official Chainweb EVM faucet:

Open Developer Tools EVM faucet in a browser.

Select Testnet from the network menu, if it isn't already selected.

Kadena EVM Faucet

Enter your Ethereum account name or account address (0x...).

Click Fund 0.5 Coins.

The faucet contract will transfer 0.5 KDA to the account you specify.

Important The Ethereum wallet account you use to connect to Chainweb EVM Testnet is on chain 20 in the Chainweb EVM Testnet network. The Ethereum chain identifier for this Chainweb EVM chain is 5920.

You should only deploy smart contracts on this chain during the initial phase of testing using Chainweb EVM Testnet. Most applications only need to be deployed on a single chain for testing purposes. However, if you need access to other chains, you must provide different network details to connect to those chains. For more information about working with other chains, see Multi-chain support.

Configure the development environment
After you have a Chainweb EVM testnet account with funds, the next step is to configure your development environment to use the Kadena Chainweb EVM Testnet network. These steps assume you are on using Hardhat, which is a popular Ethereum development framework, and the Kadena Hardhat plugin @kadena/hardhat-chainweb for multi-chain support.

Before you begin
Verify that your development environment meets the following basic requirements:

You have the Node.js runtime environment, npm or yarn package manager, and npx installed.
You have Git installed for managing your project.
You have the private key for the wallet account holding the testnet KDA funds.
You have cloned the kadena-evm-sandbox so you have access to the files in the sample solidity Hardhat project. You can model testing and deployment for your own Hardhat projects based on the configuration of the solidity project.
Configure Hardhat settings
For completeness, these steps assume you're creating a new Hardhat project. If you already have a Hardhat project, you can skip the first two steps.

To configure the development environment using Hardhat:

Create a new project directory by running a command similar to the following:

mkdir kadena-hardhat-project && cd kadena-hardhat-project

Initialize the Hardhat project in the directory by running the following commands:

npm init -y
npm install --save-dev hardhat
npx hardhat init

Follow the prompts displayed to generate a default hardhat.config.js or hardhat.config.ts file and a sample project structure.

Install the @kadena/hardhat-chainweb plugin in the root directory of your project using npm, pnpm, or yarn.

For example:

npm install @kadena/hardhat-chainweb

Install dependencies for the project.

npm install

Create a local environment (.env) file for the private key that will deploy your contract.

You can copy the .env.example from the solidity project to create the .env file and replace the placeholder key with your private key.

cp ~/kadena-evm-sandbox/solidity/.env.example .env

After you create the .env file in your Hardhat project, open the .env file and replace the placeholder key with your private key.

# PK of the deployer account
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

Open the hardhat.config.js or hardhat.config.ts file in your code editor and import the @kadena/hardhat-chainweb plugin.

For example:

import "@nomicfoundation/hardhat-toolbox";
import "@kadena/hardhat-chainweb";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";


Add Chainweb EVM network settings provided by the @kadena/hardhat-chainweb plugin.

For example, the following settings configure the testnet network settings to only deploy to chain 20, where you have an account with testnet KDA, and use the deployer private key from the .env file:

  defaultChainweb: "testnet",

  chainweb: {
    hardhat: { chains: 2 },
    
        testnet: {
   type: 'external',
   chains: 1,
   accounts: [process.env.DEPLOYER_PRIVATE_KEY],
   chainIdOffset: 5920,
   chainwebChainIdOffset: 20,
   externalHostUrl:
     "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet",
   etherscan: {
     apiKey: 'abc', // Any non-empty string works for Blockscout
     apiURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com/api/",
     browserURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com"
   },
 },
},

If you're deploying the SimpleToken contract using the sample deploy script, you can use npm to deploy with the following command:

npm run deploy testnet

This script provides output similar to the following excerpt:

> deploy
> hardhat compile && npx hardhat run scripts/deploy.js --chainweb testnet

DEPLOYER_PRIVATE_KEY in hardhat config: 0xabec8b26...17f75241
...
Chainweb:  testnet  Chains:  1  
Switched to chainweb_testnet20
Deploying with signer: 0x93A2d568...4e5d4E1d on network 20
Contracts deployed
0x9D024a48A4011e632b1492f014Eb459c894041Ac on 20
Switched to chainweb_testnet20
Waiting 10 seconds before verification...
Attempting to verify contract 0x9D024a48A4011e632b1492f014Eb459c894041Ac on chain 20...
The contract 0x9D024a48A4011e632b1492f014Eb459c894041Ac has already been verified on the block explorer. If you're trying to verify a partially verified contract, please use the --force flag.
http://chain-20.evm-testnet-blockscout.chainweb.com/address/0x9D024a48A4011e632b1492f014Eb459c894041Ac#code

✅ Contract successfully verified on chain 20
SimpleToken deployment process completed


For a complete example of the Hardhat configuration file, see the solidity project or scaffold-kadena. The scaffold-kadena repository also provides sample scripts for performing many common tasks that simplify project deployment and interacting with a contract after its deployed.

For more information about the configuration settings and options provided by the Hardhat Chainweb plugin, see hardhat-kadena-plugin or @kadena/hardhat-chainweb.

Deployer account
When you connect to Chainweb EVM Testnet to deploy, use the private key for the account you funded with testnet KDA.

Consider using environment variables for private keys—for example, use the dotenv package and process.env.PRIVATE_KEY as illustrated in the sample Hardhat configuration—to avoid hardcoding secret keys in your configuration file.

If you prefer not to expose your private keys at all, you can configure Hardhat to use a wallet provider and enter your keys manually when you deploy. However, using Hardhat scripts is more automation-friendly.

Deploy a smart contract using Hardhat
After you configure your development environment to connect to Chainweb EVM Testnet, you are ready to deploy smart contracts on the network.

To deploy using Hardhat:

Run the deployment script you've created for the smart contract and specify the --chainweb command-line option with the name you are using for the Chainweb configuration settings in the Hardhat configuration file.

For example, if you are using the evm-testnet configuration settings in the Hardhat configuration file:

npx hardhat run scripts/deploy.js --chainweb evm-testnet

For examples of Hardhat deployment scripts, see the following project files:

solidity/scripts/deploy.js
solidity/scripts/deploy-using-create2.js
scaffold-kadena.
Wait for confirmation that the transaction has been mined into a block.

As a proof-of-work network, it takes 30 seconds on average to produce a block. You should allow time for the transaction to be mined into a block and for the block to be confirmed by consensus and added to the chain. If Hardhat doesn't report errors during deployment, it's likely that the contract will be successfully deployed. You can double-check by querying the contract or looking up the transaction in a block explorer.

Congratulations! You have successfully deployed a Solidity smart contract on Kadena Chainweb EVM Testnet chain 20!

Troubleshooting
If the deployment script times out or cannot connect to the network, check that the RPC URL is correct and verify internet connectivity.

If you see an insufficient funds error, make sure the account you are using has enough testnet KDA tokens on the chain where you are deploying the contract. For example, verify that you've configured the network settings for chain 20, funded the account on chain 20, and are attempting to deploy your contract on chain 20. The transaction fee for deploying a simple contract typically costs less than 0.001 KDA, so you should have enough funds from the official faucet to deploy multiple contracts.

If you see a nonce or chainId error, check that the chain identifier you set in the Hardhat configuration file matches the network you are deploying to.

If you specify more than one chain in a Chainweb EVM configuration, Hardhat will attempt to deploy your contract on all of the chains. If you haven't added network settings for the additional chains, you'll see deployment fail with provider and insufficient funds errors. For more information about deploying to more than one chain, see Multi-chain support.

Contract verification
You can use Blockscout or the @kadena/hardhat-chainweb plugin to verify contracts on the Kadena Chainweb EVM Testnet. You can find examples of how to perform contract verification in the deploy and deploy-create2 scripts for the sample solidity project.

Note that you must configure the etherscan settings in the Hardhat configuration file for contract verification to work.

Multi-chain support
During the initial rollout of Chainweb EVM on the EVM Testnet, there will be twenty Pact chains—chains 0 through 19—and five EVM chains—chains 20 through 24. However, Kadena recommends that you only deploy contracts and test transaction execution on a single chain to ensure operations work as expected without any significant changes to your contracts or development environment.

Limiting deployments to a single chain is intended to be a temporary constraint so that network stability and data persistence can be evaluated and, potentially, improved before rolling out the additional complexities involved in multi-chain contract deployments.

The instructions for adding a custom network to your wallet provided the network information to use for Chainweb EVM chain 20. If you want to use any of the other chains, you must add the appropriate network information for that chain to the wallet.

Chainweb EVM Testnet chain 20 (Production testing)
Use the following information when adding this chain as a custom network:

Chain ID: 5920
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Block Explorer: http://chain-20.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 21
Use the following information when adding this chain as a custom network:

Chain ID: 5921
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc
Block Explorer: http://chain-21.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 22
Use the following information when adding this chain as a custom network:

Chain ID: 5922
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc
Block Explorer: http://chain-22.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 23
Use the following information when adding this chain as a custom network:

Chain ID: 5923
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/23/evm/rpc
Block Explorer: http://chain-23.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 24
Use the following information when adding this chain as a custom network:

Chain ID: 5924
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/24/evm/rpc
Block Explorer: http://chain-24.evm-testnet-blockscout.chainweb.com/
Known issues
If you attempt to add the network settings for Chainweb EVM to MetaMask from Blockscout, the Block Explorer URL isn't automatically populated. You should add the URL to the network settings manually in MetaMask to ensure that the links to the transactions that are displayed in Blockscout work as expected.

The @kadena/hardhat-chainweb plugin is compatible with Hardhat versions v2.22.18 through 2.24.3. The plugin isn't compatible with the most recently released of Hardhat, version 2.25.0

---

et started with Kadena Chainweb EVM
The Kadena network relies on nodes that run the Chainweb consensus protocol. When Ethereum transitioned from a Proof-of-Work consensus model to a Proof-of-Stake consensus model, it effectively split the blockchain into separate consensus and execution layers. This change to the architecture enabled the Ethereum Virtual Machine (EVM) to provide an execution environment that is agnostic about the underlying consensus. Because the execution layer operates independently, Chainweb nodes can provide the same EVM execution environment running in parallel with Pact while maintaining the Chainweb Proof-of-Work consensus, security, and decentralization over a multi-chain network.

How it works
The Chainweb consensus protocol enables multiple independent chains to share a common view of state beyond a certain block depth. This common view of state enables any chain in the network to verify whether historical events beyond the required block depth occurred on any other chain. For example, if a transaction occurs on chain 3, chain 3 can produce a simple payment verification (SPV) proof that chain 6 can verify by checking the shared history. The only requirement for verifying the transaction is that the proof must be conveyed from the original chain, in this example, chain 3—to the target chain, in this example, chain 6.

With this approach, security relies strictly on the shared consensus across the chains in the network. There are no relayers, oracles, validators, archives, or third-party coordinators.

The chains in the Kadena Chainweb EVM network run in parallel, but independently, allowing for concurrent transaction processing without the risk of collisions or delays. Because Chainweb provides a single common view of state, global security, and concurrent payload processing, Kadena Chainweb EVM enables cross-chain transactions to be executed more efficiently and at a lower cost than traditional bridging techniques.

At a high level, Kadena Chainweb EVM supports cross-chain activity in three main steps:

An event occurs on a source chain.

For a cross-chain transfer, a user initiates a transaction to transfer tokens from a source chain using a smart contract. The smart contract emits a well-defined cross-chain event.

An off-chain endpoint generates proof of a specific event.

For a cross-chain transfer, a user queries an endpoint that generates a simple payment verification proof or another type of proof that can be validated. The proof must encode all of the information required to uniquely identify the event on the source chain and the contract on the target chain.

The event is observed on the target chain.

For a cross-chain transfer, a user relays the proof to the target chain, where it is verified against the history shared by the source and target chains. By checking the shared history, the contract on the target chain validates that the transfer event claimed by the user occurred on the source chain. The smart contract on the target chain completes the transaction, for example, by minting the number of tokens transferred from the source chain.

Chainweb EVM development environment
The kadena-evm-sandbox repository provides tools and configuration files for developers interested in setting up a private local development environment for testing the Ethereum Virtual Machine (EVM) execution environment running on Chainweb nodes that provide the infrastructure for the Kadena blockchain network.

The repository includes a default configuration for a docker compose image that is optimized for basic frontend development with an EVM-compatible node as the backend. The default configuration includes chains 0 through 19 for Pact smart contracts and chains 20 though 24 for Solidity contracts.

What's included in the repository
The kadena-evm-sandbox repository provides everything you need to set up a local Kadena development network that runs a single Chainweb node with core backend services and a mining client. The default configuration for the development network provides five chains that use EVM as the payload provider for processing transactions.

The repository includes the following directories and components:

Name	What it provides
allocations	Files to set up an ethers project that describes a set of BIP-44 wallets and allocations to be created in the genesis block for the development network.
apps	Files to set up the contract, server, and frontend application that demonstrates cross-chain transactions.
blockscout	Files to set up an optional block explorer for the EVM chains in the development network. Blockscout instances provide an explorer interface and API similar to Etherscan.
devnet	A Docker compose project and files to set up the Chainweb node services for the development network.
docker‑bake.hcl	A script to build multi-platform images for the development network Docker compose project.
docs	Technical documentation about the functions and events proposed for the Kadena Chainweb EVM cross-chain bridging protocol in draft form.
network	An optional command-line program for starting, stopping, and monitoring the Kadena Chainweb EVM development network.
solidity	A Hardhat project that demonstrates the implementation of a simple ERC-20 token with support for burn and mint style transfers between the two EVM chains in the network.
Prerequisites and system requirements
Before you set up the Kadena Chainweb EVM development environment, verify that your local computer has the required tools installed and meets the following basic requirements:

You must have Docker and Docker Compose or an Open Container Initiative (OCI) compliant alternative.
You must have at least 4 CPU cores and 8 GB of memory available for Docker. You can configure CPU and memory for Docker using command-line options or Resource settings.
You must have a network connection to download the container images for the development network.
You must have a POSIX-compliant terminal shell for running command-line programs and scripts.
You should have bash and jq programs installed.
You must have JavaScript tooling installed, including Node.js version v22, the npm or yarn package manager, and npx to deploy Solidity contracts with Hardhat.
You must have at least 6 CPU cores and 12 GB of memory available for Docker to run the Blockscout block explorer.
Quick start
To download and install the Chainweb EVM development network:

Open a terminal shell on your computer.

Clone the kadena-evm-sandbox repository and change to the kadena-evm-sandbox directory by running the following command:

git clone https://github.com/kadena-io/kadena-evm-sandbox && cd kadena-evm-sandbox

The kadena-evm-sandbox directory includes the network command-line program that you can use to perform common tasks to manage and monitor the development network. The network program supports commands that are similar to Docker commands. You can explore all of the commands available by running the following command:

./network help

Pull the latest container images using the network command-line program by running the following command:

./network devnet pull

You can execute network commands for convenience or use docker commands directly. Pulling the latest container images isn't strictly required, but it's recommended before you start the development network for the first time.

You should see output similar to the following:

[+] Pulling 10/10
 ✔ bootnode-evm-22 Skipped - Image is already being pulled by bootnode-evm-21               0.0s
 ✔ bootnode-evm-20 Skipped - Image is already being pulled by bootnode-evm-21               0.0s 
 ✔ bootnode-evm-24 Skipped - Image is already being pulled by bootnode-evm-21               0.0s 
 ✔ bootnode-evm-23 Skipped - Image is already being pulled by bootnode-evm-21               0.0s 
 ✔ bootnode-mining-client Pulled                                                            1.7s
 ✔ allocations Pulled                                                                       1.7s
 ✔ bootnode-frontend Pulled                                                                 1.7s
 ✔ bootnode-mining-trigger Pulled                                                           1.8s
 ✔ bootnode-evm-21 Pulled                                                                   1.7s
 ✔ bootnode-consensus Pulled                                                                1.8s
   ✔ 63467be34da6 Pull complete                                                            34.9s 
   ✔ 036ac59a35be Pull complete                                                             6.4s 
   ✔ 4a057fff0021 Pull complete                                                             6.3s 


Start the network by running the following command:

./network devnet start

This command starts the development blockchain and allocates the test account addresses. You should see output similar to the following excerpt:

[+] Running 3/4
 ✔ Network chainweb-evm_bootnode-internal      Create...                                    0.1s 
 ✔ Network chainweb-evm_p2p                    Created                                      0.0s 
 ✔ Network chainweb-evm_bootnode-frontend      Create...                                    0.0s 
 ⠋ Volume "chainweb-evm_bootnode-evm-22_data"  Cr...                                        0.0s
...
 ✔ Container bootnode-evm-23                   Started                                      1.2s
 ✔ Container bootnode-evm-20                   Started                                      1.2s
 ✔ Container bootnode-evm-22                   Started                                      1.3s 
 ✔ Container bootnode-evm-24                   Started                                      1.7s 
 ✔ Container bootnode-evm-21                   Started                                      1.2s 
 ✔ Container bootnode-allocations              Started                                      1.5s 
 ✔ Container bootnode-consensus                Healthy                                      9.3s 
 ✔ Container bootnode-frontend                 Started                                      9.7s 
 ✔ Container bootnode-mining-trigger           Started                                      9.5s 
 ✔ Container bootnode-mining-client            Started                                      9.6s 
[+] Creating 1/1
 ✔ Container bootnode-evm-20    Running                                                     0.0s 
wallets created: {
  alloc0: {
    address: '0x8849BAbdDcfC1327Ad199877861B577cEBd8A7b6',
    privateKey: '0xe711c50150f500fdebec57e5c299518c2f7b36271c138c55759e5b4515dc7161'
  },
...


Check that blocks are being produced by running the following command:

./network devnet status

This command displays the current block height and cut height for the development network with output similar to the following excerpt:

Node: bootnode-consensus
chain        height  hash                                         type
0            36      G1BY2DprJ6ULTaPOt67XEDtjw03gVgu4IHXsYhHgUfs  default
1            35      Euw83eOfY1DTbQIHOnETvNYjAW6hvxMZ4RDeZWsmuzI  default
2            36      dPs3Tj6ug0c7NyG0v-XbyZdXh2QZh_WvyvZHu6uk4_I  default
3            36      OoC9hTEJmPVj3pMcjPwM0qofXS4wN4172aL5ffN2om4  default
4            36      GKNU8tzdtLNXudlvRv5orVQ8bFXN0F7pQ63MlavtE88  default
...
20           37      dsrjWRrIgsezR2InWb3EzMml28owAmIQLh20fdHVrqs  evm
21           36      j9fI_MQEYboaqx2qu2MtyBjKGTsJHb9FMq8ktVPq4zw  evm
22           36      _6quxrPShEpb0hyd3jB2VNdlQq2xmsPZFOgku4iA5SY  evm
23           37      Q_muuzU3TUZH0n1kP74tmW7VMIuelsrlGRW8TnYwqVE  evm
24           36      pUattWugcCjy_2_0ejgTx1SqaeHGvtV_nWA_Fc5PGnw  evm
...
cut-height:  3529

You can call the ./network devnet status command repeatedly to verify that the block height and cut height values are increasing.

Restarting the development network
If the development network stops producing blocks or seems stuck, you can restart the bootnode-consensus service without stopping or restarting other network components.

To restart the development network:

./network devnet restart

Stopping the development network
When you're finished testing, you can shut down the development network, remove all containers, and reset the database to a clean state.

To shut down the network and remove containers:

./network devnet stop

In some cases, you might find that stopping or restarting the network fails to return the container to a clean state. If this problem occurs, run the following command to forcibly remove orphan processes:

docker compose down --volumes --remove-orphans

After removing all containers and processes, you should be able to restart the network in a clean state.

Modifying the network configuration
The devnet folder in the kadena-evm-sandbox repository includes a Python script, compose.py, that generates the docker-compose.yaml file for the Chainweb EVM Docker Compose project. The compose.py script automates the creation of the docker-compose.yaml file with different configuration settings for the following predefined project use cases:

The app-dev project generates a configuration file optimized for application development with a single full-service bootstrap node. This configuration produces blocks at a fixed rate of two seconds per chain, has mining enabled, and exposes the Chainweb service API on the chains you specify as command-line arguments.
The kadena-dev project generates a configuration file that simulates a production environment with four node roles: one bootstrap node, one application development node, and two mining nodes. This configuration is optimized for testing and debugging Chainweb node backend services, such as consensus and peer-to-peer networking.
The minimal project generates a configuration file for a minimal development environment with one bootstrap node and simulated mining.
To generate a docker-compose.yaml for one of the predefined project use cases, add the --project command-line option and the use case project name to the compose.py script. For example, you can run the following command to generate a docker-compose.yaml file that simulates a production environment and then starts the network using that configuration:

python3.13 compose.py --project kadena-dev > docker-compose.yaml && docker compose up -d

To generate a docker-compose.yaml that's optimized for application development, you can run a command similar to the following:

python3.13 compose.py --project app-dev --exposed-chains "3, 20" > docker-compose.yaml && docker compose up -d


This example only exposes the Chainweb service API on one Pact chain (3) and one EVM chain (20). You can run compose.py script to generate the docker-compose.yaml file for any of the predefined project configurations. Alternatively, you can modify the compose.py script or write your own script to customize the development environment settings you want to use.

Test the sample Solidity project
The solidity directory provides an example of a simple Hardhat project with a Hardhat configuration file, Solidity smart contract, and test files. The project is also configured by default use to the @kadena/hardhat-chainweb and @kadena/hardhat-kadena-create2 Hardhat v2 plugins.

The @kadena/hardhat-chainweb plugin simplifies deployment to multiple chains without requiring you to configure individual chains as external networks when using Hardhat v2, and later. The plugin also supports smart contract verification. The sandbox configuration settings in the Hardhat configuration file for the solidity project provide an example of using the @kadena/hardhat-chainweb plugin to define a five-chain network.

The @kadena/hardhat-kadena-create2 supports Create2 to enable you to deploy a smart contract with the same address on all chains.

The solidity project also includes a devnet-accounts.json file with account information generated from a test BIP-44 wallet using a seed entropy value of 0x0000 0000 0000 0000 0000 0000 0000 0000 (16 zero bytes). The Hardhat configuration file reads this account information to generate accounts for you to use in the local sandbox development network configuration.

Installing dependencies
You can install Hardhat and related dependencies in the development network, if needed, by running the following command:

./network solidity setup

If the npm package manager reports any issues, address them before continuing to the next step. For example, you might be prompted to run npm audit fix to address issues.

Running tests
You can develop, test, and deploy Solidity contracts using standard Hardhat commands. For example, you can run the unit tests for the SimpleToken contract against the internal Hardhat v2 network:

npx hardhat test

The solidity project also provides sample npm scripts to perform common tasks. To execute unit tests for the SimpleToken contract using a sample npm script, run:

npm run test

The SimpleToken tests deploy the sample ERC-20 token contract and check that token transfer operations succeed or revert as expected when tokens are transferred between addresses on two Chainweb EVM chains. For example, you should see output similar to the following excerpt as tests are executed and new blocks are added to the chain:

Chainweb:  hardhat  Chains:  5  

[hardhat -] creating chains
[hardhat -] integrating chains into Chainweb
[hardhat -] Starting chain networks
Creating provider
Creating provider
...
Transferring 500000000000000000000 tokens from 20:0x5FbDB2315678afecb367f032d93F642f64180aa3:0x70997970C51812dc3A010C7d01b50e0d17dc79C8 to 21:0x5FbDB2315678afecb367f032d93F642f64180aa3:0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Initiating cross-chain transfer from chainweb_hardhat20 to chainweb_hardhat21
Switched to 20
[hardhat 20] mining requested
[hardhat 20] current height is 16
[hardhat 21] current height is 15
...
transfer-crosschain status: 1, at block number 17 with hash 0x2ac3ff7aa6dae262355da187088b9f79b70ac62309b1870a65765fea38a959e7
found log at tx 0 and event 1
waiting for SPV proof to become available on chain 21; current height 16; required height 18
[hardhat 21] mining requested
[hardhat 21] current height is 16
[hardhat 22] current height is 15
...
waiting for SPV proof to become available on chain 21; current height 17; required height 18
[hardhat 21] mining requested
[hardhat 21] current height is 17
[hardhat 22] current height is 16
...
Hex proof: 0x8b950f0e...01b1ae4d6e
Switched to 21
Redeeming tokens on chain chainweb_hardhat21
[hardhat 21] mining requested
[hardhat 21] current height is 18
[hardhat 20] current height is 17
...
result at block height 19 received with status undefined
   ✔ Should transfer tokens to same address from one chain to another (239ms)
...
   38 passing (2m)
   1 pending

[hardhat -] Stopping chain networks
[hardhat 20] Automine disabled
[hardhat 21] Automine disabled


Deploying
To deploy the SimpleToken contract against the local sandbox development network using the npm script, run:

npm run deploy sandbox

To deploy deterministically with the same address on all chains using Create2, run:

npm run deploy-create2 sandbox

To deploy the SimpleToken contract to the internal Hardhat network, run:

npm run deploy:hardhat

To deploy deterministically with the same address on all chains using Create2, run:

npm run deploy-create2:hardhat

Starting a local node
To start a separate Hardhat node, run:

npx hardhat node

After starting the node, open another terminal, then run:

npm run deploy localhost

To deploy deterministically with the same address on all chains using Create2, run:

npm run deploy-create2 localhost

Integrating with other Hardhat projects
If you want to experiment with using the Chainweb EVM development environment with other Hardhat projects, you must configure the Hardhat project to connect to the Chainweb EVM development environment much like you would configure a project to connect to an external network. You must also configure the Hardhat project to include account information—addresses and balances—for all available accounts.

You can use the solidity project as a template for how configure your Hardhat environment to use the @kadena/hardhat-chainweb plugin to develop, test, and deploy smart contracts using Hardhat v2 into local, test, and production Chainweb networks.

After a project is configured to use the Chainweb EVM development configuration settings and accounts, you can compile, test, and deploy the project using standard Hardhat commands. You can also compile, test, and deploy using any of the sample npm scripts included in the solidity project.

The project includes the following npm scripts to perform common tasks:

"scripts": {
  "build": "npx hardhat compile",
  "test": "npx hardhat test",
  "deploy:hardhat": "hardhat compile && npx hardhat run scripts/deploy.js",
  "deploy-create2:hardhat": "hardhat compile && npx hardhat run scripts/deploy-using-create2.js",
  "deploy": "hardhat compile && npx hardhat run scripts/deploy.js --chainweb",
  "deploy-create2": "hardhat compile && npx hardhat run scripts/deploy-using-create2.js --chainweb"
},

With these scripts, you can compile, test, and deploy the SimpleToken using npm run commands. For example, you can deploy a project with the same address on all chains by running the following command:

npm run deploy-create2 sandbox

Modifying the Hardhat project
To integrate with the Chainweb EVM development network:

Copy the solidity/devnet-accounts.json file into the root directory of your Hardhat project.

Install the @kadena/hardhat-chainweb and @kadena/hardhat-kadena-create2 plugins in the root directory of your project:

npm install @kadena/hardhat-chainweb @kadena/hardhat-kadena-create2

Open the hardhat.config.js or hardhat.config.ts file for your Hardhat project in your code editor.

Copy and paste the code to import plugins and read account information from the solidity/hardhat.config.js file into the Hardhat configuration file for your project.

For example:

require("@nomicfoundation/hardhat-toolbox");
require('@kadena/hardhat-chainweb');
require('@kadena/hardhat-kadena-create2');
require("hardhat-switch-network");
require("@nomicfoundation/hardhat-verify");

const { readFileSync } = require("fs");

const devnetAccounts = JSON.parse(
  readFileSync("./devnet-accounts.json", "utf-8")
);

Copy and paste the code to configure network information from the solidity/hardhat.config.js file into the Hardhat configuration file for your project.

For example:

chainweb: {
     hardhat: {
       chains: 2,
   },
   sandbox: {
     type: 'external',
     chains: 5,
     accounts: devnetAccounts.accounts.map((account) => account.privateKey),
     chainIdOffset: 1789,
     chainwebChainIdOffset: 20,
     externalHostUrl: "http://localhost:1848/chainweb/0.0/evm-development/"
   }
 },

Be sure to include the accounts key with mapping for accounts to private keys in the Chainweb EVM configuration settings.

You can also modify the configuration settings in the hardhat.config.js or hardhat.config.ts file to customize the development environment to suit your needs. For example, if you want the sandbox configuration to have two EVM chains instead of five, modify the chains setting:

...
sandbox: {
   type: 'external',
   chains: 2,
   accounts: devnetAccounts.accounts.map((account) => account.privateKey),
...
}  

(Optional) Copy and paste the code to configure etherscan settings from the solidity/hardhat.config.js file to use Blockscout into the hardhat.config.js or hardhat.config.ts file for your project.

Note that you must configure these settings if you want Blockscout to verify your smart contract.

For example:

etherscan: {
  apiKey: 'abc', // Any non-empty string works for Blockscout
  apiURLTemplate: 'http://chain-{cid}.evm.kadena.internal:8000/api/',
  browserURLTemplate: 'http://chain-{cid}.evm.kadena.internal:8000/',
},

After updating the Hardhat configuration file, you should have a hardhat.config.js or hardhat.config.ts file with configuration settings similar to the following:

 sandbox: {
   type: 'external',
   chains: 5,
   accounts: devnetAccounts.accounts.map((account) => account.privateKey),
   chainIdOffset: 1789,
   chainwebChainIdOffset: 20,
   externalHostUrl: "http://localhost:1848/chainweb/0.0/evm-development",
   etherscan: {
     apiKey: 'abc', // Any non-empty string works for Blockscout
     apiURLTemplate: 'http://chain-{cid}.evm.kadena.internal:8000/api/',
     browserURLTemplate: 'http://chain-{cid}.evm.kadena.internal:8000/',
   },
},

Save your changes and close the hardhat.config.js or hardhat.config.ts file.

Compiling and testing integration
After configuring your Hardhat project to use the Chainweb EVM development environment, you can compile, test, and deploy the project using standard hardhat commands. For example, you can compile the project by running the following command:

npx hardhat compile

You should see that your project compiles successfully:

Compiled 1 Solidity file successfully (evm target: prague).

Alternatively, you can use the npm convenience scripts. For example, to deploy a Hardhat project on the Chainweb EVM you have configured for development:

npm run deploy:hardhat

Specifying the Chainweb EVM development environment
One of the primary advantages of using the @kadena/hardhat-chainweb plugin is that it is specifically designed to enable you to interact with multiple Chainweb chains. By default, you can configure multiple networks for Hardhat, but not multiple chains in the same network. With the @kadena/hardhat-chainweb plugin, you can configure the Chainweb EVM development environment to run as a typical Hardhat network. You can maintain Hardhat as the default network and deploy a project using a specific set of Chainweb EVM configuration settings—like the sandbox settings in the solidity project—with a command like this:

npx hardhat run scripts/deploy.js --chainweb sandbox

In this command, the --chainweb command-line option behaves like the Hardhat --network option to specify the environment you want to deploy into. If you want to deploy into the Chainweb EVM sandbox environment by default, you can add a defaultChainweb key to your Hardhat configuration file.

To run scripts against the Chainweb EVM development sandbox environment:

Open the hardhat.config.js or hardhat.config.ts file for your Hardhat project in your code editor.

Add defaultChainweb to the network settings:

For example:

chainweb: {
   hardhat: {
     chains: 2,
   },
 sandbox: {
   type: 'external',
   chains: 5,
   accounts: devnetAccounts.accounts.map((account) => account.privateKey),
   chainIdOffset: 1789,
   chainwebChainIdOffset: 20,
   externalHostUrl: "http://localhost:1848/chainweb/0.0/evm-development/"
 },
},
defaultChainweb: 'sandbox',

Run hardhat deployment script or the npm run deploy command:

For example, if you are using a hardhat deployment script:

npx hardhat run scripts/deploy.js

For more information and examples of using the @kadena/hardhat-chainweb plugin, see the Kadena Hardhat Chainweb plugin.

For more information about deterministic deployment to Chainweb EVM chains, see the Kadena Hardhat Create2 plugin.

Signing transactions and switching chains
By default, when you call a Solidity smart contract from a test file or a script using ethers, the transaction is executed by the first signer address and private key for the local development environment. This is true whether the local development environment is the default Hardhat network or the Kadena Chainweb EVM development environment. For example, the following transferCrossChain transaction is signed by the account that corresponds to the first address in the list of addresses for the current network context:

const tx = await token0.transferCrossChain(receiver.address, amount, token1Info.chain);

This address is the msg.sender for the transaction and is displayed as the deploying signer when you execute the SimpleToken tests. The address is retrieved by calling the getSigners function in the solidity/test/utils/utils.js file.

Typically, if you wanted to call a smart contract function using a different signer—for example, alice—you could call the function like this:

const tx = await token0.connect(alice).transferCrossChain(receiver.address, amount, token1Info.chain);


In ethers tests, this call creates a new contract instance using the new signer alice in the background. It's important to note, however, that the signer address always has a network context associated with it.

For contracts deployed on Chainweb EVM, the network context is slightly more complex because you must know the Chainweb chain identifier where the contract is deployed to get the correct signing address.

For example, if you want to call a contract with a specific signer, you must call await chainweb.switchChain(chainId); to switch to the correct chain so that you get signers with the correct network context for that chain.

However, if you install the @kadena/hardhat-chainweb plugin, you can use the runOverChains function to handle the chain switching for you. You can find examples of switching chains in the solidity/test/SimpleToken.test.js and solidity/test/SimpleToken.integration.test.js test files.

Blockscout
You can explore the Chainweb EVM development network chains using the optional Blockscout application. Blockscout is a blockchain monitoring service that provides a user experience that is similar to Etherscan.

For additional information, see the Blockscout README.

To use Blockscout:

Open a terminal shell and change to the kadena-evm-sandbox directory, if needed.

Pull the latest images by running the following command:

./network blockscout pull

Add blockscout domains to the /etc/hosts file by running the following command:

./network blockscout add-domains

This command adds the following records to the /etc/hosts file:

127.0.0.1 chain-20.evm.kadena.local
127.0.0.1 chain-21.evm.kadena.local
127.0.0.1 chain-22.evm.kadena.local
127.0.0.1 chain-23.evm.kadena.local
127.0.0.1 chain-24.evm.kadena.local
Start a Blockscout instance by running the following command:

./network blockscout start

After running this command, it can take several minutes before you can open Blockscout in a browser.

Open the appropriate URL for the chain you want to explore:

chain 20: http://chain-20.evm.kadena.local:8000
chain 21: http://chain-21.evm.kadena.local:8000
chain 22: http://chain-22.evm.kadena.local:8000
chain 23: http://chain-23.evm.kadena.local:8000
chain 24: http://chain-24.evm.kadena.local:8000

You can view transactions executed on Chainweb EVM chains using Blockscout and the following URLs.

Chainweb EVM chain 20
Chainweb EVM chain 21
Chainweb EVM chain 22
Chainweb EVM chain 23
Chainweb EVM chain 24
Account allocations in the development network
The chain specifications include the initial account allocations for the genesis block. All of the initial accounts are generated from a BIP-44 wallet using a seed entropy value of 0x0000 0000 0000 0000 0000 0000 0000 0000 (16 zero bytes). You can view details about how the wallet is generated in the allocations/wallet.mjs file.

You can view the addresses, private keys, and starting balances by running the following command:

./network devnet allocations

The allocations in the genesis block use the following path values:

m/44'/1'/0'/0/0 (address: 0x8849BAbdDcfC1327Ad199877861B577cEBd8A7b6)
m/44'/1'/0'/0/1 (address: 0xFB8Fb7f9bdc8951040a6D195764905138F7462Ed)
m/44'/1'/0'/0/2 (address: 0x28f2d8ef4e0fe6B2E945cF5C33a0118a30a62354)
m/44'/1'/0'/0/3 (address: 0xa24a79678c9fffEF3E9A1f3cb7e51f88F173B3D5)
m/44'/1'/0'/0/4 (address: 0x47fAE86F6416e6115a80635238AFd2F18D69926B)
m/44'/1'/0'/0/5 (address: 0x87466A8266b9DFB3Dc9180a9c43946c4AB2c2cb2)
m/44'/1'/0'/0/6 (address: 0xA310Df9740eb6CC2F5E41C59C87e339142834eA4)
m/44'/1'/0'/0/7 (address: 0xD4EECE51cf451b60F59b271c5a748A8a9F16bC01)
m/44'/1'/0'/0/8 (address: 0xE08643a1C4786b573d739625FD268732dBB3d033)
m/44'/1'/0'/0/9 (address: 0x33018A42499f10B54d9dBCeBB71831C805D64cE3)
m/44'/1'/0'/0/10 (address: 0xa3659D39C901d5985450eE18a63B5b0811fDa521)
m/44'/1'/0'/0/11 (address: 0x7e99c2f1731D3750b74A2a0623C1F1DcB8cCa45e)
m/44'/1'/0'/0/12 (address: 0xFd70Bef78778Ce8554e79D97521b69183960C574)
m/44'/1'/0'/0/13 (address: 0xEE2722c39db6014Eacc5FBe43601136825b00977)
m/44'/1'/0'/0/14 (address: 0xeDD5a9185F9F1C04a011117ad61564415057bf8F)
m/44'/1'/0'/0/15 (address: 0x99b832eb3F76ac3277b00beADC1e487C594ffb4c)
m/44'/1'/0'/0/16 (address: 0xda1380825f827C6Ea92DFB547EF0a341Cbe21d77)
m/44'/1'/0'/0/17 (address: 0xc201d4A5E6De676938533A0997802634E859e78b)
m/44'/1'/0'/0/18 (address: 0x03e95Af0fC4971EdCa12E6d2d1540c28314d15d5)
m/44'/1'/0'/0/19 (address: 0x3492DA004098d728201fD82657f1207a6E5426bd)
The mining accounts are:

m/44'/1'/1'/0/0 (address: 0xd42d71cdc2A0a78fE7fBE7236c19925f62C442bA)
m/44'/1'/1'/0/1 (address: 0x38a6BD13CC381c68751BE2cef97BD79EBcb2Bb31)

---

Kadena Chainweb EVM deployment
If you are a smart contract developer who is used to building decentralized applications for Ethereum and EVM-compatible chains, deploying on the Kadena Chainweb EVM Testnet is largely the same as deploying on any other EVM-based chain.

At a high level, there are three basic steps:

Get an EVM-compatible wallet for your development account and fund it with test KDA from the Chainweb EVM Testnet faucet application.
Configure your development environment and wallet to use Chainweb EVM Testnet.
Deploy your application the way you would on any other chain.
This guide provides detailed instructions for each step. Because Hardhat is one of the most common development environment for Ethereum, this guide focuses on configuring and deploying Solidity smart contracts on Chainweb EVM Testnet using the Hardhat development environment and the @kadena/hardhat-chainweb plugin. Additional guides that focus on other development tools—such as Foundry and Remix—might be available separately, if there's sufficient interest from the broader community.

Get a wallet and tokens
Before you can deploy any smart contracts, you must have a wallet that supports EVM-compatible chains. You can add Kadena Chainweb EVM to any EVM-compatible wallet that supports adding custom networks. For example, you can add custom networks in MetaMask, Ledger, Trust Wallet, or Coinbase Wallet.

Note that wallets currently used for traditional Kadena development—such as Chainweaver, eckoWALLET, Enkrypt, Koala Wallet, or LinxWallet—only support Pact smart contracts at this time. Chainweb EVM Testnet supports Pact smart contracts on chains 0 through 19 and EVM-compatible smart contracts on chains 20 through 24. You must have an EVM-compatible wallet to interact with chains 20 through 24.

Add the Kadena network
Most EVM-compatible wallets provide an option to Add a custom network or a Connect to a custom network where you can specify details about the network you want to add or connect to. However, navigating to the network settings will vary depending on the specific wallet and version you use.

To add network settings to a MetaMask wallet:

Open the MetaMask extension in your browser.

Expand Ethereum Mainnet to display the list of networks:

Click Ethereum Mainnet to display the list of networks

Click Add a custom network at the bottom of the Enabled networks list.

Add the following network settings to add Kadena Chainweb EVM Testnet chain 20 to your wallet:

Network Name: Kadena Chainweb EVM Testnet 20
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Chain ID: 5920
Currency Symbol: KDA
Block Explorer URL: http://chain-20.evm-testnet-blockscout.chainweb.com
Alternatively, you can connect to an existing MetaMask wallet from Blockscout by clicking Add testnet@chain20.

Add to MetaMask from Blockscout

Note that navigating to network settings will depend on the EVM-compatible wallet you choose. For example, if you choose Coinbase Wallet, you must click Settings, then Networks before you have the option to Add or import a custom network. If you have trouble finding the option to connect to a custom network, consult the documentation for your specific wallet.

Fund the wallet account
After you connect your wallet account to Kadena Chainweb EVM Testnet chain 20, you need to fund the account with testnet KDA tokens to deploy contracts and pay transaction fees. Testnet KDA tokens have no monetary value but they are required to execute transactions on the network. In most cases, you can access the official Kadena EVM Faucet to fund your wallet account with enough KDA to deploy and interact with contracts on Chainweb EVM Testnet.

The funds provided by the official Kadena EVM Faucet should be sufficient for most testing scenarios. However, if the official faucet limits your ability to test because you are low on funds, contact the Kadena team to find out if there are other funding services or resources available.

To fund your wallet account using the official Chainweb EVM faucet:

Open Developer Tools EVM faucet in a browser.

Select Testnet from the network menu, if it isn't already selected.

Kadena EVM Faucet

Enter your Ethereum account name or account address (0x...).

Click Fund 0.5 Coins.

The faucet contract will transfer 0.5 KDA to the account you specify.

Important The Ethereum wallet account you use to connect to Chainweb EVM Testnet is on chain 20 in the Chainweb EVM Testnet network. The Ethereum chain identifier for this Chainweb EVM chain is 5920.

You should only deploy smart contracts on this chain during the initial phase of testing using Chainweb EVM Testnet. Most applications only need to be deployed on a single chain for testing purposes. However, if you need access to other chains, you must provide different network details to connect to those chains. For more information about working with other chains, see Multi-chain support.

Configure the development environment
After you have a Chainweb EVM testnet account with funds, the next step is to configure your development environment to use the Kadena Chainweb EVM Testnet network. These steps assume you are on using Hardhat, which is a popular Ethereum development framework, and the Kadena Hardhat plugin @kadena/hardhat-chainweb for multi-chain support.

Before you begin
Verify that your development environment meets the following basic requirements:

You have the Node.js runtime environment, npm or yarn package manager, and npx installed.
You have Git installed for managing your project.
You have the private key for the wallet account holding the testnet KDA funds.
You have cloned the kadena-evm-sandbox so you have access to the files in the sample solidity Hardhat project. You can model testing and deployment for your own Hardhat projects based on the configuration of the solidity project.
Configure Hardhat settings
For completeness, these steps assume you're creating a new Hardhat project. If you already have a Hardhat project, you can skip the first two steps.

To configure the development environment using Hardhat:

Create a new project directory by running a command similar to the following:

mkdir kadena-hardhat-project && cd kadena-hardhat-project

Initialize the Hardhat project in the directory by running the following commands:

npm init -y
npm install --save-dev hardhat
npx hardhat init

Follow the prompts displayed to generate a default hardhat.config.js or hardhat.config.ts file and a sample project structure.

Install the @kadena/hardhat-chainweb plugin in the root directory of your project using npm, pnpm, or yarn.

For example:

npm install @kadena/hardhat-chainweb

Install dependencies for the project.

npm install

Create a local environment (.env) file for the private key that will deploy your contract.

You can copy the .env.example from the solidity project to create the .env file and replace the placeholder key with your private key.

cp ~/kadena-evm-sandbox/solidity/.env.example .env

After you create the .env file in your Hardhat project, open the .env file and replace the placeholder key with your private key.

# PK of the deployer account
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

Open the hardhat.config.js or hardhat.config.ts file in your code editor and import the @kadena/hardhat-chainweb plugin.

For example:

import "@nomicfoundation/hardhat-toolbox";
import "@kadena/hardhat-chainweb";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";


Add Chainweb EVM network settings provided by the @kadena/hardhat-chainweb plugin.

For example, the following settings configure the testnet network settings to only deploy to chain 20, where you have an account with testnet KDA, and use the deployer private key from the .env file:

  defaultChainweb: "testnet",

  chainweb: {
    hardhat: { chains: 2 },
    
        testnet: {
   type: 'external',
   chains: 1,
   accounts: [process.env.DEPLOYER_PRIVATE_KEY],
   chainIdOffset: 5920,
   chainwebChainIdOffset: 20,
   externalHostUrl:
     "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet",
   etherscan: {
     apiKey: 'abc', // Any non-empty string works for Blockscout
     apiURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com/api/",
     browserURLTemplate: "http://chain-{cid}.evm-testnet-blockscout.chainweb.com"
   },
 },
},

If you're deploying the SimpleToken contract using the sample deploy script, you can use npm to deploy with the following command:

npm run deploy testnet

This script provides output similar to the following excerpt:

> deploy
> hardhat compile && npx hardhat run scripts/deploy.js --chainweb testnet

DEPLOYER_PRIVATE_KEY in hardhat config: 0xabec8b26...17f75241
...
Chainweb:  testnet  Chains:  1  
Switched to chainweb_testnet20
Deploying with signer: 0x93A2d568...4e5d4E1d on network 20
Contracts deployed
0x9D024a48A4011e632b1492f014Eb459c894041Ac on 20
Switched to chainweb_testnet20
Waiting 10 seconds before verification...
Attempting to verify contract 0x9D024a48A4011e632b1492f014Eb459c894041Ac on chain 20...
The contract 0x9D024a48A4011e632b1492f014Eb459c894041Ac has already been verified on the block explorer. If you're trying to verify a partially verified contract, please use the --force flag.
http://chain-20.evm-testnet-blockscout.chainweb.com/address/0x9D024a48A4011e632b1492f014Eb459c894041Ac#code

✅ Contract successfully verified on chain 20
SimpleToken deployment process completed


For a complete example of the Hardhat configuration file, see the solidity project or scaffold-kadena. The scaffold-kadena repository also provides sample scripts for performing many common tasks that simplify project deployment and interacting with a contract after its deployed.

For more information about the configuration settings and options provided by the Hardhat Chainweb plugin, see hardhat-kadena-plugin or @kadena/hardhat-chainweb.

Deployer account
When you connect to Chainweb EVM Testnet to deploy, use the private key for the account you funded with testnet KDA.

Consider using environment variables for private keys—for example, use the dotenv package and process.env.PRIVATE_KEY as illustrated in the sample Hardhat configuration—to avoid hardcoding secret keys in your configuration file.

If you prefer not to expose your private keys at all, you can configure Hardhat to use a wallet provider and enter your keys manually when you deploy. However, using Hardhat scripts is more automation-friendly.

Deploy a smart contract using Hardhat
After you configure your development environment to connect to Chainweb EVM Testnet, you are ready to deploy smart contracts on the network.

To deploy using Hardhat:

Run the deployment script you've created for the smart contract and specify the --chainweb command-line option with the name you are using for the Chainweb configuration settings in the Hardhat configuration file.

For example, if you are using the evm-testnet configuration settings in the Hardhat configuration file:

npx hardhat run scripts/deploy.js --chainweb evm-testnet

For examples of Hardhat deployment scripts, see the following project files:

solidity/scripts/deploy.js
solidity/scripts/deploy-using-create2.js
scaffold-kadena.
Wait for confirmation that the transaction has been mined into a block.

As a proof-of-work network, it takes 30 seconds on average to produce a block. You should allow time for the transaction to be mined into a block and for the block to be confirmed by consensus and added to the chain. If Hardhat doesn't report errors during deployment, it's likely that the contract will be successfully deployed. You can double-check by querying the contract or looking up the transaction in a block explorer.

Congratulations! You have successfully deployed a Solidity smart contract on Kadena Chainweb EVM Testnet chain 20!

Troubleshooting
If the deployment script times out or cannot connect to the network, check that the RPC URL is correct and verify internet connectivity.

If you see an insufficient funds error, make sure the account you are using has enough testnet KDA tokens on the chain where you are deploying the contract. For example, verify that you've configured the network settings for chain 20, funded the account on chain 20, and are attempting to deploy your contract on chain 20. The transaction fee for deploying a simple contract typically costs less than 0.001 KDA, so you should have enough funds from the official faucet to deploy multiple contracts.

If you see a nonce or chainId error, check that the chain identifier you set in the Hardhat configuration file matches the network you are deploying to.

If you specify more than one chain in a Chainweb EVM configuration, Hardhat will attempt to deploy your contract on all of the chains. If you haven't added network settings for the additional chains, you'll see deployment fail with provider and insufficient funds errors. For more information about deploying to more than one chain, see Multi-chain support.

Contract verification
You can use Blockscout or the @kadena/hardhat-chainweb plugin to verify contracts on the Kadena Chainweb EVM Testnet. You can find examples of how to perform contract verification in the deploy and deploy-create2 scripts for the sample solidity project.

Note that you must configure the etherscan settings in the Hardhat configuration file for contract verification to work.

Multi-chain support
During the initial rollout of Chainweb EVM on the EVM Testnet, there will be twenty Pact chains—chains 0 through 19—and five EVM chains—chains 20 through 24. However, Kadena recommends that you only deploy contracts and test transaction execution on a single chain to ensure operations work as expected without any significant changes to your contracts or development environment.

Limiting deployments to a single chain is intended to be a temporary constraint so that network stability and data persistence can be evaluated and, potentially, improved before rolling out the additional complexities involved in multi-chain contract deployments.

The instructions for adding a custom network to your wallet provided the network information to use for Chainweb EVM chain 20. If you want to use any of the other chains, you must add the appropriate network information for that chain to the wallet.

Chainweb EVM Testnet chain 20 (Production testing)
Use the following information when adding this chain as a custom network:

Chain ID: 5920
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Block Explorer: http://chain-20.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 21
Use the following information when adding this chain as a custom network:

Chain ID: 5921
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/21/evm/rpc
Block Explorer: http://chain-21.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 22
Use the following information when adding this chain as a custom network:

Chain ID: 5922
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/22/evm/rpc
Block Explorer: http://chain-22.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 23
Use the following information when adding this chain as a custom network:

Chain ID: 5923
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/23/evm/rpc
Block Explorer: http://chain-23.evm-testnet-blockscout.chainweb.com/
Chainweb EVM Testnet chain 24
Use the following information when adding this chain as a custom network:

Chain ID: 5924
RPC: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/24/evm/rpc
Block Explorer: http://chain-24.evm-testnet-blockscout.chainweb.com/

---

Develop with kadena-cli
The Kadena command-line interface (kadena-cli) provides direct access to the Kadena blockchain and to commands that help you create, test, deploy, and manage applications for the Kadena network. You can use the Kadena command-line interface to perform tasks interactively or in scripts and automated workflows that don't allow interactive input.

The Kadena CLI has one primary entry point—the kadena parent command. By providing a single entry point for performing a wide range of tasks, the Kadena CLI integrates naturally into the typical development workflow. With commands designed specifically for building, testing, and managing Kadena-based applications, you can focus on building innovative applications using familiar tools.

Before you begin
Before you use the Kadena command-line interface, verify the following basic requirements:

You have node, version 18 or later, installed.

Run node --version to verify the version you are running.

You have the pnpm package manager installed.

Depending on your development environment, you can install pnpm using a standalone script or using a package manager. For example, you can run the command brew install pnpm or npm install --global pnpm to install pnpm on your local computer. For more information about installing pnpm on different operating systems, see Installation.

Run pnpm --version to verify that you have pnpm installed and the version you are running.

Install
The Kadena CLI is packaged in a TypeScript library that you can install using a package manager such as npm or pnpm.

To install globally using npm package manager, run the following command:

npm install --global @kadena/kadena-cli

To install globally using pnpm package manager, run the following command:

pnpm install --global @kadena/kadena-cli

To verify the package is installed and display usage information, type kadena and press Return:

kadena

To see the version of the package you have installed, run the following command:

kadena version

Get started
The kadena-cli package is designed to streamline the development workflow with commands that provide direct access to everything you need to build on and interact with Kadena networks. Whether you're doing local development, deploying an application on the test network, or managing your accounts and keys on the Kadena main network, you can use the kadena-cli commands to complete tasks without leaving your development environment.

The following diagram provides an overview of the kadena command-line interface:

Kadena command-line interface at a glance

Prepare a development workspace
You can use the kadena entry point to run commands that help you set up a complete local development environment. You can use the command-line interface to generate random keys, create local wallets, add accounts, customize network connections, and construct and send transactions. After you prepare a development workspace, you can use kadena CLI commands in combination with other tools—like Pact and Kadena client—to create, test, deploy, and manage decentralized applications for the Kadena network.

Start with interactive prompting
The kadena-cli package is designed to simplify setting up a development environment. Its intuitive commands prompt you for all of the information required to complete tasks, like creating accounts or managing keys. Responding to prompts interactively is typically the best approach when getting started, eliminating the need to look up or remember the arguments required for the action you want to perform.

To start using the CLI in interactive mode, you simply type kadena followed by a subject that describes the type of information you want to work with and a verb to describe what you want to do. You don't need to specify any additional arguments or options.

For example, if you want to add a new wallet but aren't sure of all the required flags and arguments, you can start by entering the following command:

kadena wallet add

The CLI then displays interactive prompts, asking for the information required to successfully complete the task at hand—in this example, adding the wallet to your local development environment. As you gain experience, you can reduce interactive prompting by specifying some or all of the arguments as part of the command. If you run any command without specifying all of its required parameters, the CLI prompts you to provide the missing information.

Configure initial settings
After installing the kadena-cli package, the first step for working with the Kadena command-line interface is to use kadena config init to create a configuration folder to store information about your development environment and connecting to Kadena networks. Depending on where you want the configuration settings available for your projects to use, you can create the configuration folder in a working directory or in your home directory.

By default, a Kadena configuration folder named .kadena is created in your current working directory. The settings in the folder are then available to projects within that directory. For example, if you run kadena config init with $HOME/projects/my-kadena-project as your current working folder, you can access the .kadena configuration settings from anywhere inside the my-kadena-project project folder. Creating the configuration folder in a working directory enables you to have different configuration settings for different projects.

If you want to use the same configuration settings from any folder on your computer, you can create a global configuration folder in your home directory by running the kadena config init --global command. The --global command-line option adds the kadena configuration folder to the .config folder in your home directory so that the settings are available globally on your computer.

Configuration settings that are defined in a local working directory take precedence over configuration settings defined in the home directory. If you add more than one configuration folder to your development environment, you can use kadena config show to see details about the development environment you have configured in your working or global directory.

To configure initial settings:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena config init on the command line to create the configuration folder interactively:

kadena config init

This command creates the .kadena configuration folder location in your current working directory and adds default network settings to a networks subfolder, then prompts you to create a wallet. For example:

Created configuration directory:

/Users/pistolas/MY-KADENA/.kadena

Added default networks:

  - mainnet
  - testnet
  - devnet
  ? Would you like to create a wallet? (Use arrow keys)
  ❯ Yes
    No

If you already have keys and an account or an existing wallet that you want to use, you can select No to end the interactive session. However, wallets are an important part of interacting with any blockchain, so you can create one now as part of your initial configuration steps.

Select Yes and press Return to continue setting up your local development environment.

Enter a wallet name and press Return. For example:

? Enter your wallet name: pistolas

Enter and confirm a password for the wallet to generate a public and secret key pair. For example:

? Enter the new wallet password: ********
? Re-enter the password: ********

After entering the password, you are prompted to create an account using the wallet key generated for your first wallet. For example:

? Create an account using the first wallet key? (Use arrow keys)
❯ Yes
  No

Select Yes to continue setting up your local development environment with a local account.

Enter an alias for the local account and press Return. For example:

? Enter an alias for an account: pistolas-kda

The command automatically creates a local Kadena principal account and displays information about your account and wallet. For example:

====================================================
== 🚨 IMPORTANT: Mnemonic Phrase 🚨 ==
====================================================
Mnemonic Phrase:
upset crater alien galaxy humble appear prize all glove globe music number

Please store the mnemonic phrase in a SAFE and SECURE place.
This phrase is the KEY to recover your wallet. Losing it means losing access to your assets.

====================================================

First keypair generated
publicKey: 61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546

Wallet Storage Location
.kadena/wallets/pistolas.yaml

Account created
accountName: k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546

Account Storage Location
.kadena/accounts/pistolas-kda.yaml

Executed:
kadena config init --create-wallet="true" --wallet-name="pistolas" --create-account="true" --account-alias="pistolas-kda"


Be sure to copy and store the mnemonic phrase in a safe place. This 12-word secret phrase is required if you ever need to recover your wallet.

You now have a public key that you can use to sign transactions and authorize certain activity. In this example, the public key for the wallet is 61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546. You also have the principal account associated with the key. In this example, the principal account name is k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546.

For more information about accounts names, keys, and principal accounts, see Accounts, keys, and principals.

View wallet and account information
At this point, you have one public and secret key pair, a local wallet, and a local account. However, this information isn't associated with a specific network—devnet, testnet, or mainnet—or with any chain identifier (0-19). Before you add the account to a specific network and chain, you might want to verify the information you have defined so far to understand the current state of your development environment.

View wallet information
To view information about the wallet:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena wallet list on the command line to list wallet information interactively:

kadena wallet list

This command prompts you to select a wallet. For example:

? Select a wallet: (Use arrow keys)
❯ All Wallets
  pistolas

Select All Wallets, then press Return.

If you have only one wallet, you should see output similar to the following:

Wallet: pistolas
Alias Index Public key
N/A   0     61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546

Executed:
kadena wallet list --wallet-name="all"

View account information
To view information about the account:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena account list on the command line to list account information interactively:

kadena account list

This command prompts you to select an account. For example:

? Select an account (alias - account name): (Use arrow keys)
❯ All accounts
  pistolas-kda      - k:61cf22....6c355546

Select All accounts, then press Return.

If you have only one account, you should see output similar to the following:

Alias        Name                             Public Key(s)            Predicate Fungible
pistolas-kda k:61cf22aa8f20....7743bf6c355546 61cf22aa8f....bf6c355546 keys-all  coin

Executed:
kadena account list --account-alias="all"

Note that the account name k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546, shortened to k:61cf22aa8f20....7743bf6c355546, uses the default keys-all predicate and the fungible for the account is coin. The keys-all predicate is a guard. Guards define the condition that must be satisfied for an operation to proceed. In this case, all public keys associated with the k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546 account must sign transactions.

The first wallet and default account information provide you with the basics for signing transactions: a public key, an account name, and a predicate. However, there aren't many practical applications that involve signing transactions using a local account. Before you can use an account to send and receive funds and sign the most common types of transactions, it must exist on a network and have funds on one or more chains.

Fund your first onchain account
To create an account on the Kadena main network, you need to either have KDA already or know someone who can transfer funds to your account for you. However, for local development or development on the Kadena test network, you can fund your account using kadena account commands, a faucet application, or publicly available private keys.

If you created a local wallet and an account using the wallet key, you can use that information to add your account to the development or test network on one or more chains.

To fund an onchain account:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena account fund on the command line to fund an account interactively:

kadena account fund

Select the account alias you used for your first account. For example:

? Select an account (alias - account name): (Use arrow keys)
❯ pistolas-kda      - k:61cf22....6c355546

Enter an amount, then press Return. For example:

? Enter an amount: 2

You can request up to 20 coins per network. If you select more than one chain in the request, the coins are distributed equally over the chain identifiers you specify. For example, if you request 20 coins for the development network and chains 0-3, each chain receives five coins.

Select a network, then press Return. For example, enter devnet to make this account available on the local development network:

? Select a network: (Use arrow keys)
❯ devnet
  testnet

Select one or more chain identifiers, then press Return. For example, enter all:

? Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all): all

If prompted to deploy the faucet module on the network, select Yes. For example:

? Do you wish to deploy faucet module? (Use arrow keys)
❯ Yes
  No

If you selected all chains and are deploying the faucet module, you should see output similar to the following:

Deployed faucet module on chain "18, 0, 7, 12, 4, 3, 1, 6, 11, 10, 13, 9, 14, 5, 16, 15, 2, 8, 19, 17" in "devnet" network.

Success with Warnings:
Account "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546" does not exist on Chain ID(s) 3, 8, 6, 11, 1, 16, 5, 10, 2, 4, 9, 13, 0, 7, 18, 19, 15, 12, 14, 17. So the account will be created on these Chain ID(s).

Transaction explorer URL for
Chain ID "0" : http://localhost:8080/explorer/development/tx/7vkKlYWDDyM8Ceau1gEG_8G6UfwZsahYgsafEd5ak74
...
Chain ID "19" : http://localhost:8080/explorer/development/tx/JbQ4KlPGxTEfeirvDd7HOj4uwFG8HVipmmNfP4YnmLM
✔ Funding account successful.

Account "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546" funded with 2 coin(s) on Chain ID(s) "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19" in development network.
Use "kadena account details" command to check the balance.

Executed:
kadena account fund --account="pistolas-kda" --amount="2" --network="devnet" --chain-ids="all" --deployFaucet


Verify account information for the account for a subset of chains. For example, to see account details for chains 1, 2, and 3 formatted as JSON output, you can specify command-line options similar to the following:

kadena account details --account="pistolas-kda" --network="devnet" --chain-ids="1-3" --json

This command displays output similar to the following:

Details of account "pistolas-kda" on network "development"
[
  {
    "1": {
      "guard": {
        "pred": "keys-all",
        "keys": [
          "61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
        ]
      },
      "balance": 2,
      "account": "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
    }
  },
  {
    "2": {
      "guard": {
        "pred": "keys-all",
        "keys": [
          "61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
        ]
      },
      "balance": 2,
      "account": "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
    }
  },
  {
    "3": {
      "guard": {
        "pred": "keys-all",
        "keys": [
          "61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
        ]
      },
      "balance": 2,
      "account": "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
    }
  },
]

You now have one account on the development network with the same account name and public key on twenty development chains. The account on each chain has a balance of two KDA coins. To make this development environment more interesting—and learn about additional CLI commands—you can create additional accounts on the development network or the test network.

Add another account
There are several ways you can create additional accounts for testing in your local development environment. For example, you can:

Add another wallet with a completely new public and secret key pair (kadena wallet add).
Generate new random keys for a completely independent account (kadena key generate).
Import keys from a wallet you've previously created for a new account (kadena wallet import).
Add new keys from your first wallet to create a new account (kadena account add).
The following example illustrates how to use kadena account add to create a new local account.

To add a new local account:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena account add on the command line to fund an account interactively:

kadena account add

You are prompted to select the method for providing the public keys for the new account. Because you already have a wallet, you can add a new account based on the public key and secret key pair generated for that wallet. If you have other keys you want to use, you can also add accounts by manually providing them. However, to keep things simple, use your first wallet.

Use the arrow keys to select Wallet, then press Return. For example:

? How would you like to add the account locally?
  Manually - Provide public keys to add to account manually
❯ Wallet - Provide public keys to add to account by selecting from a wallet

Select the wallet alias you set for the first wallet, then press Return. For example:

? Select a wallet: (Use arrow keys)
❯ Wallet: pistolas

Enter a new alias for this account, then press Return.

Because you're adding a new account for this wallet, you must give it a new alias. For example:

? Enter an alias for an account: pistolas-local

Enter the name of a fungible for the account, then press Return.

You can specify coin or nft as the fungible for an account. For most accounts, the default—coin—is appropriate. You can press Return to accept the default.

? Enter the name of a fungible: coin

Select the public keys that should be used for the account.

You can select Generate new public key to generate a new random public key from the original wallet key pair. This key can be recovered using the same 12-word secret phrase you saved for your first wallet. For example:

? Select public keys to add to account(index - alias - publickey):
 ◯ 0  61cf22aa8f....bf6c355546
❯◉ Generate new public key

Enter the wallet password, then press Return.

Select a keyset predicate for the account, then press Return.

If this account is only going to have one owner and one public key, select the default keys-all predicate. If an account has more than one owner and public key, select an appropriate predicate.

After you select the predicate and press Return, the account information is displayed in a confirmation message similar to the following:

The account configuration "pistolas-local" has been saved in .kadena/accounts/pistolas-local.yaml


Executed:
kadena account add --from="wallet" --wallet-name="pistolas" --account-alias="pistolas-local" --fungible="coin" --public-keys="ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105" --predicate="keys-all"


You now have one onchain account and one local account.

View updated account information
After you've added a second account, you might want to check your updated information with a simple command-line option instead of interactive prompting.

To verify your updated account information:

Open a terminal shell in your working or home directory.

Verify the information for all accounts by running the following command:

kadena account list --account-alias="all"

The command now displays information for two account similar to the following:

Alias          Name                             Public Key(s)            Predicate Fungible
pistolas-kda   k:61cf22aa8f20....7743bf6c355546 61cf22aa8f....bf6c355546 keys-all  coin
pistolas-local k:ad833b6bbfc7....28f3249fd5e105 ad833b6bbf....249fd5e105 keys-all  coin

Format command output
In some cases, you might want to format the output from a command, so it can be used as input to another command or easier to parse. You can use the --json or --yaml flag to convert the output from virtually any CLI command to JSON or YAML format.

To format the output using JSON:

Open a terminal shell in your working or home directory.

Add the --json flag to the command line.

For example:

kadena account list --account-alias="all" --json

With the --json flag, the command displays account information in JSON format similar to the following:

[
  {
    "name": "k:61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546",
    "fungible": "coin",
    "publicKeys": [
      "61cf22aa8f209b1a5549242601b4a217f034e3d931b6522ccb7743bf6c355546"
    ],
    "predicate": "keys-all",
    "alias": "pistolas-kda.yaml"
  },
  {
    "name": "k:ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105",
    "fungible": "coin",
    "publicKeys": [
      "ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105"
    ],
    "predicate": "keys-all",
    "alias": "pistolas-local.yaml"
  }
]

Add a simple transaction
You must have an onchain account to sign and submit transactions that transfer funds. However, you can use local accounts for transactions that read information from the blockchain or that execute commands with local calls. The following example illustrates how to create and execute a simple transaction using a transaction template and a local account.

Create a transaction template
To create a transaction template:

Open a terminal shell in your working or home directory..

Create a YAML API request file to execute a simple command similar to the following:

code: (* 5 5)
meta:
  chainId: '{{chain-id}}'
  sender: '{{{account:from}}}'
  gasLimit: 600
  gasPrice: 0.000001
  ttl: 600
networkId: '{{network:networkId}}'

This transaction uses template variables to construct a transaction. You can learn more about transaction templates and variables in Construct a transaction. For more information about using YAML request files for transactions, see Formatting API requests in YAML.

Save the file as a transaction template by giving it a name with the .ktpl file extension and moving the file to the .kadena/transaction-templates folder.

For example, save the file as .kadena/transaction-templates/simple-code.ktpl in your working directory.

Create the transaction
To create a transaction from the template:

Create a transaction from the template by running the following command:

kadena tx add

Select the transaction template you created, then press Return.

For example:

? Which template do you want to use:
  Select file path
  safe-transfer.ktpl
❯ simple-code.ktpl
  transfer.ktpl

Press Return to skip using a data file.

Specify any chain identifier, then press Return.

Select your local account alias as the transaction sender, then press Return.

For example:

? Select account alias for template value account:from:
  Enter account manually
  pistolas-kda   k:61cf22....6c355546 coin 61cf2....355546 keys-all
❯ pistolas-local k:ad833b....9fd5e105 coin ad833....d5e105 keys-all

Select the network for the transaction, then press Return.

? Select network id for template value networkId: (Use arrow keys)
❯ devnet
  mainnet
  testnet

Type a name for the transaction request JSON file, then press Return.

In this example, the transaction request is named my-code. After you press Return the command displays the JSON object, the location of the file, and the command executed to create the transaction. For example:

{
  "cmd": "{\"payload\":{\"exec\":{\"code\":\"(* 5 5)\",\"data\":{}}},\"nonce\":\"\",\"networkId\":\"development\",\"meta\":{\"sender\":\"k:ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105\",\"chainId\":\"3\",\"creationTime\":1715888245,\"gasLimit\":600,\"gasPrice\":0.000001,\"ttl\":600},\"signers\":[]}",
  "hash": "hyu6NGeQybOGOdJtnuZZ5SJoxurzTyTE2q5yd9OX-ic",
  "sigs": []
}

transaction saved to: ./my-code.json

Executed:
kadena tx add --template="simple-code.ktpl" --template-data="" --chain-id="3" --account:from="k:ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105" --network:networkId="development" --out-file="my-code.json"


Test the transaction
To test the transaction:

Submit the transaction on the local endpoint by running the following command:

kadena tx test

Select the transaction you created from the template, then press Return. For example:

? Select a transaction file:
❯◉ Transaction: my-code.json

After you press Return, you should see output similar to the following:

--------------------------------------------------------------------------------
  txSignedTransaction test result:
--------------------------------------------------------------------------------
  Transaction info:
     fileName: my-code.json
     transactionHash: hyu6NGeQybOGOdJtnuZZ5SJoxurzTyTE2q5yd9OX-ic


  Response:
    Response:
       gas: 6
       result:
         status: success
         data: 25
       reqKey: hyu6NGeQybOGOdJtnuZZ5SJoxurzTyTE2q5yd9OX-ic
       logs: wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8
       metaData:
         publicMeta:
           creationTime: 1715888245
           ttl: 600
           gasLimit: 600
           chainId: 3
           gasPrice: 0.000001
           sender: k:ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105
         blockTime: 1715888557715218
         prevBlockHash: Gf_T16uJG4TtVG1VKzIsvHrgbGW4_93mRMucymBeTu8
         blockHeight: 4029
       continuation: null
       txId: null


  Details:
     chainId: 3
     network: devnet
     networkId: development
     networkHost: http://localhost:8080
     networkExplorerUrl: http://localhost:8080/explorer/development/tx/


  Transaction Command:
     cmd: {"payload":{"exec":{"code":"(* 5 5)","data":{}}},"nonce":"","networkId":"development","meta":{"sender":"k:ad833b6bbfc72fb7d18b88cd5b4349f82b2f015be8e4b5e7ad28f3249fd5e105","chainId":"3","creationTime":1715888245,"gasLimit":600,"gasPrice":0.000001,"ttl":600},"signers":[]}
     hash: hyu6NGeQybOGOdJtnuZZ5SJoxurzTyTE2q5yd9OX-ic
     sigs:
--------------------------------------------------------------------------------

Executed:
kadena tx test --tx-signed-transaction-files="my-code.json" --tx-transaction-network="devnet"


Set a default network
Many commands require you to specify the network you want to work with. You can streamline command execution by setting a default network. For example, if you are just getting started, you might want to set the default network to devnet to save time as you iterate on your application. Later, you might want to unset the default, so you can specify the network to use on a command-by-command basis. As your application matures, you might want change the default network from devnet to testnet so you can deploy updates for broader testing.

To set the default network:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena network set-default on the command line to set the default network interactively:

kadena network set-default

Because you're running the command interactively, you are prompted to select a network. For example:

? Select a network (Use arrow keys)
❯ devnet
  mainnet
  testnet

Use the up and down arrow keys to select the network you want to use as your default network, then press Return. For example, select devnet, then press Return.

Select Yes to confirm your default network, then press Return.

The command displays confirmation of your default network. For example:

The network configuration "devnet" has been set as default.

Executed:
kadena network set-default --network="devnet" --confirm

After setting the default network, you won't be prompted to select a network when running other commands. If you want to remove the default network from your configuration, run the following command:

kadena network set-default --network none --confirm

The command displays confirmation of your change. For example:

The default network configuration has been removed.

Run commands in automated scripts
For most commands, responding to interactive prompts and confirmation messages helps to ensure that you provide all of the information necessary to successfully execute each command. However, if you want to disable all interactive prompts and confirmation messages, you can use the --quiet flag. The --quiet flag enables you to run commands in environments where interactive input is impractical, such as automated test suites and continuous integration (CI) pipelines.

If you include the --quiet flag in a command, the command suppresses all interactive prompts and skips all confirmation messages, so that each command can run uninterrupted without human intervention. Running commands using the --quiet flag ensures that automated processes can run smoothly and efficiently, without manual input. If you use the --quiet flag for a command, you must include all required arguments in the command line.

Create a project
You can use the kadena dappcommand to create a new project directory for the decentralized application you want to build. This command allows you to create an empty project directory or to create a new project from one of the frontend framework templates that are currently supported. You can create the new project using templates for the following frontend frameworks:

Angular
Nextjs
Vuejs
To create a new project from a template:

Open a terminal shell on the computer where you've installed the kadena-cli package.

Enter kadena dapp add <app-name> on the command line to create a new project directory with the name you specify. For example, to create a project named my-to-do:

kadena dapp add my-to-do

Because you're running the command interactively, you are prompted to select a template. For example:

? What template do you want to use? (Use arrow keys)
❯ Angular
  Next JS
  Vue JS

Use the up and down arrow keys to select the template to use for your project, then press Return.

If you are missing required dependencies for the template you select, you are prompted to install them.

Confirm that you want to install missing dependencies.

Change to your project directory by running a command similar to the following:

cd my-to-do

If you explore the project directory, you'll see it contains the
 appropriate template files and folders for the framework you selected plus a pact folder with some starter code for a Pact module (message-store.pact) and for testing the Pact module in the Pact REPL (message-store.repl).