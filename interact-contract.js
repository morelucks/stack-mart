#!/usr/bin/env node

import { makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode, uintCV, principalCV, stringAsciiCV, listCV, noneCV } from '@stacks/transactions';
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
const CONTRACT_ADDRESS = 'SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B';
const CONTRACT_NAME = 'stack-mart';
const network = STACKS_MAINNET;

async function getNonce(address) {
  const url = `https://api.hiro.so/v2/accounts/${address}?proof=0`;
  const res = await fetch(url);
  const data = await res.json();
  return BigInt(data.nonce || 0);
}

async function sendTx(functionName, functionArgs, nonce) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderKey: PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 50000,
    nonce
  };

  const tx = await makeContractCall(txOptions);
  const result = await broadcastTransaction({ transaction: tx, network });
  
  if ('error' in result) {
    console.log(`❌ ${functionName} failed:`, result.error);
  } else {
    console.log(`✅ ${functionName}: ${result.txid}`);
    console.log(`   https://explorer.hiro.so/txid/${result.txid}?chain=mainnet`);
  }
  
  return result;
}

async function main() {
  console.log('🚀 Interacting with StackMart Contract');
  console.log('=====================================\n');

  let nonce = await getNonce(CONTRACT_ADDRESS.split('.')[0]);

  // TX 1: Create a listing
  console.log('TX 1: Creating listing...');
  await sendTx('create-listing', [
    uintCV(1000000), // 1 STX price
    uintCV(500), // 5% royalty
    principalCV(CONTRACT_ADDRESS)
  ], nonce++);

  await new Promise(r => setTimeout(r, 2000));

  // TX 2: Create another listing
  console.log('\nTX 2: Creating second listing...');
  await sendTx('create-listing', [
    uintCV(3000000), // 3 STX
    uintCV(750), // 7.5% royalty
    principalCV(CONTRACT_ADDRESS)
  ], nonce++);

  await new Promise(r => setTimeout(r, 2000));

  // TX 3: Toggle wishlist
  console.log('\nTX 3: Adding to wishlist...');
  await sendTx('toggle-wishlist', [
    uintCV(1)
  ], nonce++);

  await new Promise(r => setTimeout(r, 2000));

  // TX 4: Set marketplace fee
  console.log('\nTX 4: Setting marketplace fee...');
  await sendTx('set-marketplace-fee', [
    uintCV(250) // 2.5% fee
  ], nonce++);

  await new Promise(r => setTimeout(r, 2000));

  // TX 5: Update listing price
  console.log('\nTX 5: Updating listing price...');
  await sendTx('update-listing-price', [
    uintCV(1),
    uintCV(1500000) // 1.5 STX
  ], nonce++);

  console.log('\n✅ All 5 transactions submitted!');
  console.log('⏳ Wait ~10 minutes for confirmations');
}

main().catch(console.error);
