const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DiceTipping contract to Kadena EVM...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", hre.ethers.utils.formatEther(balance), "KDA");

  if (balance.isZero()) {
    console.log("⚠️  Warning: Account has no balance. Fund it at:");
    console.log("   https://faucet.evm-testnet.chainweb.com/");
    console.log("   Enter address:", deployer.address);
    return;
  }

  // Deploy the contract
  console.log("📦 Deploying DiceTipping contract...");
  const DiceTipping = await hre.ethers.getContractFactory("DiceTipping");

  const contract = await DiceTipping.deploy();
  await contract.deployed();

  console.log("✅ DiceTipping deployed successfully!");
  console.log("📍 Contract address:", contract.address);
  console.log("🔗 Transaction hash:", contract.deployTransaction.hash);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("⛓️  Chain ID:", network.chainId);

  // Display block explorer links
  if (network.chainId === 5920) {
    console.log("🔍 View on Blockscout:");
    console.log(`   Contract: http://chain-20.evm-testnet-blockscout.chainweb.com/address/${contract.address}`);
    console.log(`   Transaction: http://chain-20.evm-testnet-blockscout.chainweb.com/tx/${contract.deployTransaction.hash}`);
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    deployerAddress: deployer.address,
    transactionHash: contract.deployTransaction.hash,
    network: network.name,
    chainId: network.chainId,
    timestamp: new Date().toISOString(),
    blockNumber: contract.deployTransaction.blockNumber
  };

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `DiceTipping-${network.chainId}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/ directory");

  // Verify initial contract state
  console.log("\n🔧 Verifying initial contract state...");
  const platformFee = await contract.platformFeePercentage();
  const minTip = await contract.minimumTipAmount();
  const minDonation = await contract.minimumDonationAmount();

  console.log("   Platform fee:", platformFee.toString(), "basis points (", (platformFee / 100).toString(), "%)");
  console.log("   Min tip amount:", hre.ethers.utils.formatEther(minTip), "KDA");
  console.log("   Min donation amount:", hre.ethers.utils.formatEther(minDonation), "KDA");

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