const { genKeyPair } = require('@kadena/cryptography-utils');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const path = require('path');

// Configuration file path
const CONFIG_FILE = path.join(__dirname, 'deployment-config.json');

function setupDeployment() {
  console.log('🔧 Setting up Kadena testnet deployment...');

  let config = {};

  // Check if config already exists
  if (existsSync(CONFIG_FILE)) {
    console.log('📄 Loading existing configuration...');
    config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
  } else {
    console.log('🆕 Creating new deployment configuration...');

    // Generate new keypair for admin
    const adminKeypair = genKeyPair();

    config = {
      admin: {
        publicKey: adminKeypair.publicKey,
        secretKey: adminKeypair.secretKey,
        account: `k:${adminKeypair.publicKey}`
      },
      network: {
        networkId: 'testnet04',
        chainId: '1',
        host: 'https://api.testnet.chainweb.com',
        gasLimit: 150000,
        gasPrice: 0.00000001,
        ttl: 600
      },
      contract: {
        namespace: 'free',
        name: 'dice-tipping',
        fullName: 'free.dice-tipping'
      }
    };

    // Save configuration
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('💾 Configuration saved to deployment-config.json');
  }

  // Display configuration
  console.log('\n📋 Deployment Configuration:');
  console.log('🔑 Admin Account:', config.admin.account);
  console.log('🌐 Network:', config.network.networkId);
  console.log('⛓️  Chain ID:', config.network.chainId);
  console.log('📦 Contract:', config.contract.fullName);

  console.log('\n⚠️  IMPORTANT: Fund your admin account with testnet KDA before deployment!');
  console.log('💰 Visit: https://faucet.testnet.chainweb.com/');
  console.log('📧 Account to fund:', config.admin.account);

  return config;
}

function getBalance(account) {
  const { Pact } = require('@kadena/client');

  return async function checkBalance() {
    try {
      const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));

      const balanceTx = Pact.builder
        .execution(`(coin.get-balance "${account}")`)
        .setMeta({
          chainId: config.network.chainId,
          sender: account,
          gasLimit: 1000,
          gasPrice: config.network.gasPrice,
          ttl: config.network.ttl
        })
        .setNetworkId(config.network.networkId)
        .createTransaction();

      const response = await fetch(`${config.network.host}/chainweb/0.0/${config.network.networkId}/chain/${config.network.chainId}/pact/api/v1/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(balanceTx)
      });

      const result = await response.json();

      if (result.result.status === 'success') {
        const balance = result.result.data;
        console.log(`💰 Balance for ${account}: ${balance} KDA`);
        return balance;
      } else {
        console.log(`❌ Account ${account} not found or has 0 KDA`);
        return 0;
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      return 0;
    }
  };
}

// Fund account helper
function getFundingInstructions() {
  const config = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));

  console.log('\n💳 How to fund your account:');
  console.log('1. Visit: https://faucet.testnet.chainweb.com/');
  console.log('2. Enter your account:', config.admin.account);
  console.log('3. Select Chain ID:', config.network.chainId);
  console.log('4. Request testnet KDA');
  console.log('5. Wait for confirmation');

  return config.admin.account;
}

module.exports = {
  setupDeployment,
  getBalance,
  getFundingInstructions,
  CONFIG_FILE
};

// Run setup if called directly
if (require.main === module) {
  if (process.argv.includes('--balance')) {
    const account = process.argv[process.argv.indexOf('--balance') + 1];
    if (account) {
      getBalance(account)();
    } else {
      console.log('Usage: node setup-deployment.js --balance <account>');
    }
  } else if (process.argv.includes('--fund-info')) {
    getFundingInstructions();
  } else {
    setupDeployment();
  }
}