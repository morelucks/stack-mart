#!/usr/bin/env node

import { makeContractDeploy, broadcastTransaction, AnchorMode, ClarityVersion, getAddressFromPrivateKey } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { readFileSync } from 'fs';

// Load environment
const env = {};
readFileSync('.env', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().split('#')[0].trim();
  }
});

const PRIVATE_KEY = env.PRIVATE_KEY;
const network = STACKS_MAINNET;
const FEE = 150000;

if (!PRIVATE_KEY) {
  console.error('ERROR: PRIVATE_KEY not found in .env');
  process.exit(1);
}

// Read contract
const contractCode = readFileSync('contracts/sip-010-token.clar', 'utf8');
const deployerAddress = getAddressFromPrivateKey(PRIVATE_KEY, network.version);

console.log('=== StackMart Tips Token Deployment ===');
console.log(`Network: mainnet`);
console.log(`Deployer: ${deployerAddress}`);
console.log(`Contract: stackmart-tips`);
console.log('');

// Fetch nonce
console.log('Fetching nonce...');
const accountUrl = `https://api.hiro.so/v2/accounts/${deployerAddress}?proof=0`;
const accountResponse = await fetch(accountUrl);
const accountData = await accountResponse.json();
const accountNonce = BigInt(accountData.nonce || 0);
console.log(`Nonce: ${accountNonce}`);

// Deploy
const txOptions = {
  contractName: 'stackmart-tips',
  codeBody: contractCode,
  senderKey: PRIVATE_KEY,
  network,
  anchorMode: AnchorMode.Any,
  clarityVersion: ClarityVersion.Clarity2,
  fee: FEE,
  postConditionMode: 0x01,
  nonce: accountNonce,
};

console.log('Creating transaction...');
const transaction = await makeContractDeploy(txOptions);

console.log(`TX ID: ${transaction.txid()}`);
console.log('Broadcasting...');

const broadcastResponse = await broadcastTransaction({ transaction, network });

if ('error' in broadcastResponse) {
  console.error('❌ Deployment failed:', broadcastResponse.error);
  process.exit(1);
} else {
  console.log('\n✅ StackMart Tips token deployed!');
  console.log(`📋 TX ID: ${broadcastResponse.txid}`);
  console.log(`🔗 Explorer: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
  console.log(`📝 Contract: ${deployerAddress}.stackmart-tips`);
}
