import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const toggleWishlist = async (listingId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'toggle-wishlist',
    functionArgs: [uintCV(listingId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Wishlist toggled:', data.txId);
    }
  });
};
