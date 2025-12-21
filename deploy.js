#!/usr/bin/env node

import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion, getAddressFromPrivateKey } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { readFileSync } from 'fs';

// Load environment variables from .env
const env = {};
try {
  const envFile = readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove inline comments
      value = value.split('#')[0].trim();
      env[key] = value;
    }
  });
} catch (e) {
  console.error('Error reading .env file:', e.message);
  process.exit(1);
}

const PRIVATE_KEY = env.PRIVATE_KEY;
const NETWORK = env.STACKS_NETWORK || 'mainnet';
const API_URL = env.STACKS_API_URL;
const FEE = parseInt(env.FEE || '150000', 10);

if (!PRIVATE_KEY) {
  console.error('ERROR: PRIVATE_KEY not found in .env file');
  process.exit(1);
}

// Read contract file
let contractCode;
try {
  contractCode = readFileSync('contracts/stack-mart.clar', 'utf8');
} catch (e) {
  console.error('Error reading contract file:', e.message);
  process.exit(1);
}

// Create network instance - use STACKS_MAINNET/STACKS_TESTNET directly
// Override URL if custom API URL is provided
const baseNetwork = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const network = API_URL && API_URL !== (NETWORK === 'mainnet' ? 'https://api.hiro.so' : 'https://api.testnet.hiro.so')
  ? { ...baseNetwork, coreApiUrl: API_URL }
  : baseNetwork;

// Get deployer address from private key
const deployerAddress = getAddressFromPrivateKey(PRIVATE_KEY, network.version);

console.log('=== StackMart Contract Deployment ===');
console.log(`Network: ${NETWORK}`);
console.log(`API URL: ${network.coreApiUrl || API_URL || 'default'}`);
console.log(`Deployer Address: ${deployerAddress}`);
console.log(`Fee: ${FEE} microSTX (${FEE / 1000000} STX)`);
console.log(`Contract: stack-mart`);
console.log('');

// Fetch account nonce first
console.log('Fetching account nonce...');
let accountNonce;
try {
  const apiUrl = network.coreApiUrl || (NETWORK === 'mainnet' ? 'https://api.hiro.so' : 'https://api.testnet.hiro.so');
  const accountUrl = `${apiUrl}/v2/accounts/${deployerAddress}?proof=0`;
  const accountResponse = await fetch(accountUrl);
  const accountData = await accountResponse.json();
  accountNonce = BigInt(accountData.nonce || 0);
  console.log(`Current nonce: ${accountNonce}`);
} catch (e) {
  console.warn('Could not fetch nonce, using 0:', e.message);
  accountNonce = 0n;
}

// Create contract deploy transaction
const txOptions = {
  contractName: 'stack-mart',
  codeBody: contractCode,
  senderKey: PRIVATE_KEY,
  network: network,
  anchorMode: AnchorMode.Any,
  clarityVersion: ClarityVersion.Clarity3,
  fee: FEE,
  postConditionMode: 0x01,
  nonce: accountNonce,
};

try {
  console.log('Creating deployment transaction...');
  const transaction = await makeContractDeploy(txOptions);
  
  console.log('Transaction created:');
  console.log(`  TX ID: ${transaction.txid()}`);
  console.log(`  Contract ID: ${deployerAddress}.stack-mart`);
  console.log('');
  
  console.log('Broadcasting transaction to network...');
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  if ('error' in broadcastResponse) {
    console.error('❌ Deployment failed:', broadcastResponse.error);
    console.error('💡 Common causes:');
    console.error('   - Insufficient STX balance for fees');
    console.error('   - Contract name already exists');
    console.error('   - Network connectivity issues');
    console.error('   - Invalid contract syntax');
    process.exit(1);
  } else {
    console.log('\n✅ Contract deployed successfully!');
    console.log(`📋 Transaction ID: ${broadcastResponse.txid}`);
    console.log(`🔗 Explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK}`);
    console.log(`📝 Contract Address: ${deployerAddress}.stack-mart`);
    console.log('');
    console.log('⏳ Waiting for transaction confirmation...');
    console.log('   (This may take ~10 minutes)');
  }
} catch (error) {
  console.error('❌ Error deploying contract:', error);
  if (error.message.includes('nonce')) {
    console.error('\nTip: You may need to wait for a previous transaction to confirm, or check your account balance.');
  }
  process.exit(1);
}
