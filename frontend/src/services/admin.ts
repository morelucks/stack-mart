import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV, boolCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const setAdmin = async (newAdmin: string) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-admin',
    functionArgs: [principalCV(newAdmin)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Admin updated:', data.txId);
    },
    onCancel: () => {
      console.log('Admin update cancelled');
    }
  });
};

export const setMarketplaceFee = async (newFee: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-marketplace-fee',
    functionArgs: [uintCV(newFee)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Marketplace fee updated:', data.txId);
    },
    onCancel: () => {
      console.log('Fee update cancelled');
    }
  });
};

export const setFeeRecipient = async (newRecipient: string) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-fee-recipient',
    functionArgs: [principalCV(newRecipient)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Fee recipient updated:', data.txId);
    },
    onCancel: () => {
      console.log('Fee recipient update cancelled');
    }
  });
};

export const setPaused = async (paused: boolean) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-paused',
    functionArgs: [boolCV(paused)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Pause state updated:', data.txId);
    },
    onCancel: () => {
      console.log('Pause update cancelled');
    }
  });
};

export const emergencyPauseListing = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'emergency-pause-listing',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Listing paused:', data.txId);
    },
    onCancel: () => {
      console.log('Emergency pause cancelled');
    }
  });
};

export const emergencyRefundEscrow = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'emergency-refund-escrow',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Escrow refunded:', data.txId);
    },
    onCancel: () => {
      console.log('Emergency refund cancelled');
    }
  });
};
