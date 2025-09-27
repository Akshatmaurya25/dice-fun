const { Pact, createSignWithKeypair } = require('@kadena/client');
const { readFileSync, existsSync } = require('fs');
const path = require('path');
const { CONFIG_FILE } = require('./setup-deployment');

// Load configuration
function loadConfig() {
  if (!existsSync(CONFIG_FILE)) {
    throw new Error('❌ Configuration file not found. Run: node setup-deployment.js');
  }
  return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
}

const config = loadConfig();
const signWithKeypair = createSignWithKeypair({
  publicKey: config.admin.publicKey,
  secretKey: config.admin.secretKey
});

async function deployTippingContract() {
  try {
    console.log('🚀 Starting deployment of Dice Tipping Contract to Kadena Testnet...');

    // Read the contract file
    const contractCode = readFileSync(path.join(__dirname, 'dice-tipping.pact'), 'utf8');

    // Create the deployment transaction
    const deployTx = Pact.builder
      .execution(contractCode)
      .addData({
        'dice-tipping-admin': {
          keys: [config.admin.publicKey],
          pred: 'keys-all'
        }
      })
      .addKeyset('dice-tipping-admin', 'keys-all', config.admin.publicKey)
      .setMeta({
        chainId: config.network.chainId,
        sender: config.admin.account,
        gasLimit: config.network.gasLimit,
        gasPrice: config.network.gasPrice,
        ttl: config.network.ttl
      })
      .setNetworkId(config.network.networkId)
      .createTransaction();

    // Sign the transaction
    const signedTx = await signWithKeypair(deployTx);

    console.log('📝 Transaction created and signed');
    console.log('Transaction hash:', signedTx.hash);

    // Submit to testnet
    const response = await fetch(`${config.network.host}/chainweb/0.0/${config.network.networkId}/chain/${config.network.chainId}/pact/api/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cmds: [signedTx]
      })
    });

    const submitResult = await response.json();
    console.log('📤 Submit result:', submitResult);

    if (submitResult.requestKeys && submitResult.requestKeys.length > 0) {
      const requestKey = submitResult.requestKeys[0];
      console.log('⏳ Waiting for transaction confirmation...');

      // Poll for result
      await pollForResult(requestKey);
    }

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

async function pollForResult(requestKey, maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${config.network.host}/chainweb/0.0/${config.network.networkId}/chain/${config.network.chainId}/pact/api/v1/poll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestKeys: [requestKey]
        })
      });

      const pollResult = await response.json();

      if (pollResult[requestKey]) {
        const result = pollResult[requestKey];
        if (result.result.status === 'success') {
          console.log('✅ Contract deployed successfully!');
          console.log('📋 Deployment details:');
          console.log('   - Contract:', config.contract.fullName);
          console.log('   - Chain:', config.network.chainId);
          console.log('   - Network:', config.network.networkId);
          console.log('   - Request Key:', requestKey);
          console.log('   - Gas Used:', result.gas);
          return result;
        } else {
          console.error('❌ Transaction failed:', result.result.error);
          throw new Error(result.result.error.message);
        }
      } else {
        console.log(`⏳ Attempt ${attempt}/${maxAttempts}: Transaction still pending...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Polling attempt ${attempt} failed:`, error);
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error('Transaction confirmation timeout');
}


// Test contract functions after deployment
async function testContract() {
  console.log('🧪 Testing contract functions...');

  try {
    // Test get-user-stats function
    const testTx = Pact.builder
      .execution(`(${config.contract.fullName}.get-user-stats "test-account")`)
      .setMeta({
        chainId: config.network.chainId,
        sender: config.admin.account,
        gasLimit: 10000,
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
      body: JSON.stringify(testTx)
    });

    const result = await response.json();
    console.log('✅ Contract test successful:', result.result);

  } catch (error) {
    console.error('❌ Contract test failed:', error);
  }
}

// Export functions for use
module.exports = {
  deployTippingContract,
  testContract,
  loadConfig
};

// Run deployment if called directly
if (require.main === module) {
  if (process.argv.includes('--test')) {
    testContract();
  } else {
    deployTippingContract()
      .then(() => {
        console.log('🎉 Deployment completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Deployment failed:', error);
        process.exit(1);
      });
  }
}