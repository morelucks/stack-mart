import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';
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
