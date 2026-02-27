import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV, stringAsciiCV, listCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const rateTransaction = async (counterparty: string, rating: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'rate-transaction',
    functionArgs: [principalCV(counterparty), uintCV(rating)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Rating submitted:', data.txId);
    },
    onCancel: () => {
      console.log('Rating cancelled');
    }
  });
};

export const setListingCategory = async (
  listingId: number,
  category: string,
  tags: string[]
) => {
  const tagsCV = listCV(tags.map(tag => stringAsciiCV(tag)));
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-listing-category',
    functionArgs: [uintCV(listingId), stringAsciiCV(category), tagsCV],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Category set:', data.txId);
    },
    onCancel: () => {
      console.log('Category update cancelled');
    }
  });
};

export const setListingActive = async (listingId: number, active: boolean) => {
  const { boolCV } = await import('@stacks/transactions');
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-listing-active',
    functionArgs: [uintCV(listingId), boolCV(active)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Listing status updated:', data.txId);
    },
    onCancel: () => {
      console.log('Status update cancelled');
    }
  });
};

export const promoteListing = async (listingId: number, durationBlocks: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'promote-listing',
    functionArgs: [uintCV(listingId), uintCV(durationBlocks)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Listing promoted:', data.txId);
    },
    onCancel: () => {
      console.log('Promotion cancelled');
    }
  });
};

export const createListingWithNFT = async (
  nftContract: string,
  tokenId: number,
  price: number,
  royaltyBips: number,
  royaltyRecipient: string,
  licenseTerms?: string
) => {
  const { someCV, noneCV, stringAsciiCV: strCV } = await import('@stacks/transactions');
  
  const licenseCV = licenseTerms ? someCV(strCV(licenseTerms)) : noneCV();
  
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-listing-with-nft',
    functionArgs: [
      principalCV(nftContract),
      uintCV(tokenId),
      uintCV(price),
      uintCV(royaltyBips),
      principalCV(royaltyRecipient),
      licenseCV
    ],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('NFT listing created:', data.txId);
    },
    onCancel: () => {
      console.log('NFT listing cancelled');
    }
  });
};
