import { openContractCall } from '@stacks/connect';
import { uintCV, bufferCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const buyListingEscrow = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'buy-listing-escrow',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Escrow created:', data.txId);
    },
    onCancel: () => {
      console.log('Escrow creation cancelled');
    }
  });
};

export const attestDelivery = async (listingId: number, deliveryHash: string) => {
  const hashBuffer = Buffer.from(deliveryHash, 'hex');
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'attest-delivery',
    functionArgs: [uintCV(listingId), bufferCV(hashBuffer)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Delivery attested:', data.txId);
    },
    onCancel: () => {
      console.log('Delivery attestation cancelled');
    }
  });
};

export const confirmReceipt = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'confirm-receipt',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Receipt confirmed:', data.txId);
    },
    onCancel: () => {
      console.log('Receipt confirmation cancelled');
    }
  });
};

export const rejectDelivery = async (listingId: number, reason: string) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'reject-delivery',
    functionArgs: [uintCV(listingId), stringAsciiCV(reason)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Delivery rejected:', data.txId);
    },
    onCancel: () => {
      console.log('Delivery rejection cancelled');
    }
  });
};

export const releaseEscrow = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'release-escrow',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Escrow released:', data.txId);
    },
    onCancel: () => {
      console.log('Escrow release cancelled');
    }
  });
};

export const cancelEscrow = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'cancel-escrow',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Escrow cancelled:', data.txId);
    },
    onCancel: () => {
      console.log('Escrow cancellation cancelled');
    }
  });
};
