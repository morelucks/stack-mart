import { useState, useCallback } from 'react';
import { useWallet } from './useWallet';
import * as services from '../services';

/**
 * Unified hook for all contract interactions
 * Provides a single interface for all marketplace operations
 */
export const useContract = () => {
  const { address, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const executeTransaction = useCallback(
    async (fn: () => Promise<void>, errorMessage: string) => {
      if (!isConnected) {
        setError('Wallet not connected');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        console.error(errorMessage, err);
      } finally {
        setLoading(false);
      }
    },
    [isConnected]
  );

  // Listing operations
  const createListing = useCallback(
    async (price: number, royaltyBips: number, royaltyRecipient: string) => {
      await executeTransaction(
        () => services.createListing(price, royaltyBips, royaltyRecipient),
        'Failed to create listing'
      );
    },
    [executeTransaction]
  );

  const buyListing = useCallback(
    async (listingId: number) => {
      await executeTransaction(
        () => services.buyListing(listingId),
        'Failed to buy listing'
      );
    },
    [executeTransaction]
  );

  const updateListingPrice = useCallback(
    async (listingId: number, newPrice: number) => {
      await executeTransaction(
        () => services.updateListingPrice(listingId, newPrice),
        'Failed to update price'
      );
    },
    [executeTransaction]
  );

  // Auction operations
  const createAuction = useCallback(
    async (
      nftContract: string,
      tokenId: number,
      startPrice: number,
      reservePrice: number,
      duration: number
    ) => {
      await executeTransaction(
        () => services.createAuction(nftContract, tokenId, startPrice, reservePrice, duration),
        'Failed to create auction'
      );
    },
    [executeTransaction]
  );

  const placeBid = useCallback(
    async (auctionId: number, amount: number) => {
      await executeTransaction(
        () => services.placeBid(auctionId, amount),
        'Failed to place bid'
      );
    },
    [executeTransaction]
  );

  const endAuction = useCallback(
    async (auctionId: number, nftContract: string) => {
      await executeTransaction(
        () => services.endAuction(auctionId, nftContract),
        'Failed to end auction'
      );
    },
    [executeTransaction]
  );

  // Escrow operations
  const buyWithEscrow = useCallback(
    async (listingId: number) => {
      await executeTransaction(
        () => services.buyListingEscrow(listingId),
        'Failed to create escrow'
      );
    },
    [executeTransaction]
  );

  const attestDelivery = useCallback(
    async (listingId: number, deliveryHash: string) => {
      await executeTransaction(
        () => services.attestDelivery(listingId, deliveryHash),
        'Failed to attest delivery'
      );
    },
    [executeTransaction]
  );

  const confirmReceipt = useCallback(
    async (listingId: number) => {
      await executeTransaction(
        () => services.confirmReceipt(listingId),
        'Failed to confirm receipt'
      );
    },
    [executeTransaction]
  );

  // Dispute operations
  const createDispute = useCallback(
    async (escrowId: number, reason: string) => {
      await executeTransaction(
        () => services.createDispute(escrowId, reason),
        'Failed to create dispute'
      );
    },
    [executeTransaction]
  );

  const voteOnDispute = useCallback(
    async (disputeId: number, vote: boolean) => {
      await executeTransaction(
        () => services.voteOnDispute(disputeId, vote),
        'Failed to vote on dispute'
      );
    },
    [executeTransaction]
  );

  // Bundle operations
  const createBundle = useCallback(
    async (listingIds: number[], discountBips: number) => {
      await executeTransaction(
        () => services.createBundle(listingIds, discountBips),
        'Failed to create bundle'
      );
    },
    [executeTransaction]
  );

  const buyBundle = useCallback(
    async (bundleId: number) => {
      await executeTransaction(
        () => services.buyBundle(bundleId),
        'Failed to buy bundle'
      );
    },
    [executeTransaction]
  );

  // Wishlist operations
  const toggleWishlist = useCallback(
    async (listingId: number) => {
      await executeTransaction(
        () => services.toggleWishlist(listingId),
        'Failed to toggle wishlist'
      );
    },
    [executeTransaction]
  );

  return {
    // State
    loading,
    error,
    txId,
    address,
    isConnected,
    
    // Listing operations
    createListing,
    buyListing,
    updateListingPrice,
    
    // Auction operations
    createAuction,
    placeBid,
    endAuction,
    
    // Escrow operations
    buyWithEscrow,
    attestDelivery,
    confirmReceipt,
    
    // Dispute operations
    createDispute,
    voteOnDispute,
    
    // Bundle operations
    createBundle,
    buyBundle,
    
    // Wishlist operations
    toggleWishlist,
    
    // Utility
    clearError: () => setError(null),
  };
};
