const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🚀 Deploying DiceTipping contract to Kadena EVM...");

  // Check if private key is configured
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === 'your_private_key_here_without_0x_prefix') {
    console.log("❌ No valid private key found in .env file");
    console.log("📝 Please:");
    console.log("   1. Copy .env.example to .env");
    console.log("   2. Add your private key to PRIVATE_KEY");
    console.log("   3. Get testnet KDA from: https://faucet.evm-testnet.chainweb.com/");
    return;
  }

  console.log("✅ Private key configured");

  // Get the deployer account
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.log("❌ No signers available. Check your private key configuration.");
    return;
  }

  const [deployer] = signers;
  console.log("📋 Deploying with account:", deployer.address);

  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "KDA");

  if (balance === 0n) {
    console.log("⚠️  Warning: Account has no balance. Fund it at:");
    console.log("   https://faucet.evm-testnet.chainweb.com/");
    console.log("   Enter address:", deployer.address);
    return;
  }

  // Deploy the contract
  console.log("📦 Deploying DiceTipping contract...");
  const DiceTipping = await hre.ethers.getContractFactory("DiceTipping");

  const contract = await DiceTipping.deploy();
  await contract.waitForDeployment();

  console.log("✅ DiceTipping deployed successfully!");
  console.log("📍 Contract address:", await contract.getAddress());
  console.log("🔗 Transaction hash:", contract.deploymentTransaction().hash);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("⛓️  Chain ID:", network.chainId);

  const contractAddress = await contract.getAddress();
  const txHash = contract.deploymentTransaction().hash;

  // Display block explorer links
  if (network.chainId === 5920n) {
    console.log("🔍 View on Blockscout:");
    console.log(`   Contract: http://chain-20.evm-testnet-blockscout.chainweb.com/address/${contractAddress}`);
    console.log(`   Transaction: http://chain-20.evm-testnet-blockscout.chainweb.com/tx/${txHash}`);
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    transactionHash: txHash,
    network: network.name,
    chainId: network.chainId.toString(),
    timestamp: new Date().toISOString(),
    blockNumber: contract.deploymentTransaction().blockNumber
  };

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `DiceTipping-${network.chainId.toString()}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/ directory");

  // Verify initial contract state
  console.log("\n🔧 Verifying initial contract state...");
  const platformFee = await contract.platformFeePercentage();
  const minTip = await contract.minimumTipAmount();
  const minDonation = await contract.minimumDonationAmount();

  console.log("   Platform fee:", platformFee.toString(), "basis points (", (Number(platformFee) / 100).toString(), "%)");
  console.log("   Min tip amount:", hre.ethers.formatEther(minTip), "KDA");
  console.log("   Min donation amount:", hre.ethers.formatEther(minDonation), "KDA");

  console.log("\n✨ Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("   1. Update your frontend with the contract address");
  console.log("   2. Test the contract functions");
  console.log("   3. Configure your app to use Kadena EVM network");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });