// Marketplace type definitions for @stacks/transactions integration

export interface Listing {
  id: number;
  seller: string;
  price: number;
  royaltyBips: number;
  royaltyRecipient: string;
  nftContract?: string;
  tokenId?: number;
  licenseTerms?: string;
}

export interface Auction {
  id: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  startPrice: number;
  reservePrice: number;
  currentBid: number;
  highestBidder?: string;
  endBlock: number;
  active: boolean;
}

export interface Escrow {
  listingId: number;
  buyer: string;
  amount: number;
  createdAtBlock: number;
  state: 'pending' | 'delivered' | 'confirmed' | 'disputed' | 'released' | 'cancelled';
  timeoutBlock: number;
  deliveryHash?: string;
}

export interface Dispute {
  id: number;
  escrowId: number;
  reason: string;
  buyerStake: number;
  sellerStake: number;
  resolved: boolean;
  winner?: 'buyer' | 'seller';
}

export interface Bundle {
  id: number;
  listingIds: number[];
  discountBips: number;
  creator: string;
}

export interface Offer {
  id: number;
  listingId: number;
  offerer: string;
  amount: number;
  expiresAt: number;
  accepted: boolean;
}

export interface MarketplaceStats {
  totalListings: number;
  totalVolume: number;
  totalFeesCollected: number;
  activeAuctions: number;
  activeEscrows: number;
  marketplaceFee: number;
}

export interface Reputation {
  successfulSales: number;
  failedSales: number;
  totalRating: number;
  ratingCount: number;
  totalVolume: number;
}
