import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const makeOffer = async (
  listingId: number,
  amount: number,
  durationBlocks: number
) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'make-offer',
    functionArgs: [uintCV(listingId), uintCV(amount), uintCV(durationBlocks)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Offer made:', data.txId);
    },
    onCancel: () => {
      console.log('Offer cancelled');
    }
  });
};

export const acceptOffer = async (offerId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'accept-offer',
    functionArgs: [uintCV(offerId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Offer accepted:', data.txId);
    },
    onCancel: () => {
      console.log('Offer acceptance cancelled');
    }
  });
};

export const cancelOffer = async (offerId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'cancel-offer',
    functionArgs: [uintCV(offerId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Offer cancelled:', data.txId);
    },
    onCancel: () => {
      console.log('Offer cancellation cancelled');
    }
  });
};
