import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  principalCV, 
  listCV, 
  tupleCV,
  PostConditionMode 
} from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

/**
 * Batch operations using @stacks/connect and @stacks/transactions
 * Enables multiple operations in single transactions
 */

export const bulkCreateListings = async (
  listings: Array<{
    price: number;
    royaltyBips: number;
    royaltyRecipient: string;
  }>
) => {
  const listingsCV = listCV(
    listings.map(listing =>
      tupleCV({
        price: uintCV(listing.price),
        'royalty-bips': uintCV(listing.royaltyBips),
        'royalty-recipient': principalCV(listing.royaltyRecipient),
      })
    )
  );

  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'bulk-create-listings',
    functionArgs: [listingsCV],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Bulk listings created:', data.txId);
    },
    onCancel: () => {
      console.log('Bulk creation cancelled');
    },
  });
};

export const batchUpdatePrices = async (
  updates: Array<{ listingId: number; newPrice: number }>
) => {
  // Execute multiple price updates
  // Note: This would require a contract function for batch updates
  // For now, we'll execute them sequentially
  const promises = updates.map(({ listingId, newPrice }) =>
    openContractCall({
      network: getNetwork(),
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'update-listing-price',
      functionArgs: [uintCV(listingId), uintCV(newPrice)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log(`Price updated for listing ${listingId}:`, data.txId);
      },
    })
  );

  await Promise.all(promises);
};

export const batchToggleWishlist = async (listingIds: number[]) => {
  const promises = listingIds.map(listingId =>
    openContractCall({
      network: getNetwork(),
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'toggle-wishlist',
      functionArgs: [uintCV(listingId)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log(`Wishlist toggled for listing ${listingId}:`, data.txId);
      },
    })
  );

  await Promise.all(promises);
};

export const batchRateTransactions = async (
  ratings: Array<{ counterparty: string; rating: number }>
) => {
  const promises = ratings.map(({ counterparty, rating }) =>
    openContractCall({
      network: getNetwork(),
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'rate-transaction',
      functionArgs: [principalCV(counterparty), uintCV(rating)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log(`Rating submitted for ${counterparty}:`, data.txId);
      },
    })
  );

  await Promise.all(promises);
};
