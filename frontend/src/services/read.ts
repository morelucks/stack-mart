import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const getWishlist = async (userAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-wishlist',
    functionArgs: [principalCV(userAddress)],
    senderAddress: userAddress
  });

  return cvToJSON(result);
};

export const getListing = async (listingId: number, senderAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-listing',
    functionArgs: [uintCV(listingId)],
    senderAddress
  });

  return cvToJSON(result);
};

export const getSellerReputation = async (userAddress: string, senderAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-seller-reputation',
    functionArgs: [principalCV(userAddress)],
    senderAddress
  });

  return cvToJSON(result);
};
