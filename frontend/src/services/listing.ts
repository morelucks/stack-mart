import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const createListing = async (
  price: number,
  royaltyBips: number,
  royaltyRecipient: string
) => {
  const functionArgs = [
    uintCV(price),
    uintCV(royaltyBips),
    principalCV(royaltyRecipient)
  ];

  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-listing',
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Transaction:', data.txId);
    }
  });
};
