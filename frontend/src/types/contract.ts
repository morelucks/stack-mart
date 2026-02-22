/**
 * Type definitions for StackMart contract interactions
 */

export interface Listing {
  id: number;
  seller: string;
  nftContract: string;
  nftId: number;
  price: number;
  title: string;
  description: string;
  active: boolean;
  createdAt: number;
}

export interface Auction {
  id: number;
  seller: string;
  nftContract: string;
  nftId: number;
  startPrice: number;
  reservePrice: number;
  currentBid: number;
  highestBidder: string | null;
  endBlock: number;
  active: boolean;
}

export interface Bundle {
  id: number;
  creator: string;
  listingIds: number[];
  discountPercent: number;
  totalPrice: number;
  active: boolean;
}

export interface Dispute {
  id: number;
  escrowId: number;
  raiser: string;
  reason: string;
  votesFor: number;
  votesAgainst: number;
  resolved: boolean;
  outcome: boolean | null;
}

export interface EscrowStatus {
  buyer: string;
  seller: string;
  amount: number;
  delivered: boolean;
  confirmed: boolean;
  disputed: boolean;
}

export interface Reputation {
  totalSales?: number;
  totalPurchases?: number;
  successfulTransactions: number;
  disputes: number;
  rating: number;
  totalVolume: number;
}

export interface TransactionHistory {
  txType: string;
  listingId: number;
  amount: number;
  timestamp: number;
  counterparty: string;
}

export interface PriceHistory {
  price: number;
  timestamp: number;
}

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: any;
  anchorMode: any;
  postConditionMode: any;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}
