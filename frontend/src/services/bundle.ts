import { openContractCall } from '@stacks/connect';
import { uintCV, listCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const createBundle = async (listingIds: number[], discountBips: number) => {
  const listingIdsCV = listCV(listingIds.map(id => uintCV(id)));
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-bundle',
    functionArgs: [listingIdsCV, uintCV(discountBips)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Bundle created:', data.txId);
    },
    onCancel: () => {
      console.log('Bundle creation cancelled');
    }
  });
};

export const buyBundle = async (bundleId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'buy-bundle',
    functionArgs: [uintCV(bundleId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Bundle purchased:', data.txId);
    },
    onCancel: () => {
      console.log('Bundle purchase cancelled');
    }
  });
};

export const createCuratedPack = async (
  listingIds: number[],
  packPrice: number,
  curator: string
) => {
  const listingIdsCV = listCV(listingIds.map(id => uintCV(id)));
  const { principalCV } = await import('@stacks/transactions');
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-curated-pack',
    functionArgs: [listingIdsCV, uintCV(packPrice), principalCV(curator)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Curated pack created:', data.txId);
    },
    onCancel: () => {
      console.log('Pack creation cancelled');
    }
  });
};

export const buyCuratedPack = async (packId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'buy-curated-pack',
    functionArgs: [uintCV(packId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Pack purchased:', data.txId);
    },
    onCancel: () => {
      console.log('Pack purchase cancelled');
    }
  });
};
