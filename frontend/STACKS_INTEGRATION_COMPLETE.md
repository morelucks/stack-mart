# Complete Stacks Integration Guide

## Overview

This document describes the comprehensive integration of StackMart with @stacks/connect and @stacks/transactions.

## Architecture

### Services Layer

All contract interactions use @stacks/connect's `openContractCall` for write operations and @stacks/transactions' `callReadOnlyFunction` for reads.

#### Core Services

1. **listing.ts** - Basic listing operations
   - createListing
   - updateListingPrice
   - buyListing

2. **auction.ts** - Auction functionality
   - createAuction (with NFT trait support)
   - placeBid
   - endAuction

3. **escrow.ts** - Secure escrow system
   - buyListingEscrow
   - attestDelivery (with delivery hash)
   - confirmReceipt
   - rejectDelivery
   - releaseEscrow
   - cancelEscrow

4. **dispute.ts** - Dispute resolution
   - createDispute
   - stakeOnDispute
   - voteOnDispute
   - resolveDispute
   - claimDisputeStake

5. **bundle.ts** - Bundle purchases
   - createBundle (with listCV)
   - buyBundle
   - createCuratedPack
   - buyCuratedPack

6. **offers.ts** - Price negotiation
   - makeOffer
   - acceptOffer
   - cancelOffer

7. **admin.ts** - Admin functions
   - setAdmin
   - setMarketplaceFee
   - setFeeRecipient
   - setPaused
   - emergencyPauseListing
   - emergencyRefundEscrow

8. **advanced.ts** - Advanced features
   - rateTransaction
   - setListingCategory
   - setListingActive
   - promoteListing
   - createListingWithNFT

9. **read.ts** - Read-only functions
   - getListing
   - getAuction
   - getEscrow
   - getDispute
   - getBundle
   - getOffer
   - getWishlist
   - getSellerReputation
   - getMarketplaceStats

### Hooks Layer

Custom React hooks for data fetching and state management:

- **useWallet** - Wallet connection state
- **useListing** - Listing data fetching
- **useAuction** - Auction data fetching
- **useEscrow** - Escrow state management
- **useMarketplaceStats** - Analytics data
- **useTokenBalance** - Token balance tracking

### Components Layer

#### Forms & Input
- CreateListingForm
- UpdatePriceForm
- BundleCreator
- OfferMaker

#### Display & Cards
- ListingCard
- EnhancedListingCard
- AuctionCard
- MarketplaceStats

#### Management
- EscrowManager
- DisputePanel
- AdminPanel

#### UI Elements
- PriceDisplay
- AddressDisplay
- TransactionLink
- LoadingSpinner
- ErrorMessage
- ConnectWalletButton

### Pages Layer

- **HomePage** - Landing page with marketplace overview
- **MarketplacePage** - Browse all listings
- **ListingDetail** - Individual listing details
- **AuctionPage** - Create and bid on auctions
- **EscrowPage** - Manage escrows and disputes
- **BundlesPage** - Create and buy bundles
- **TokenPage** - Token management

## Clarity Value Conversions

### Using @stacks/transactions

```typescript
import { 
  uintCV,           // Numbers
  principalCV,      // Addresses
  contractPrincipalCV, // Contract addresses
  stringAsciiCV,    // ASCII strings
  bufferCV,         // Byte buffers
  boolCV,           // Booleans
  listCV,           // Lists
  someCV,           // Optional (some)
  noneCV            // Optional (none)
} from '@stacks/transactions';
```

### Examples

```typescript
// Simple listing
await createListing(
  1000000,  // price (uintCV)
  500,      // royalty bips (uintCV)
  'SP...'   // recipient (principalCV)
);

// Auction with NFT
await createAuction(
  'SP000.nft-contract',  // contractPrincipalCV
  1,                     // token ID (uintCV)
  1000000,              // start price (uintCV)
  5000000,              // reserve price (uintCV)
  144                   // duration (uintCV)
);

// Bundle with multiple listings
await createBundle(
  [1, 2, 3],  // listCV of uintCV
  1000        // discount bips (uintCV)
);

// Delivery attestation
await attestDelivery(
  1,                    // listing ID (uintCV)
  'abc123...'          // delivery hash (bufferCV)
);

// Dispute with reason
await createDispute(
  1,                    // escrow ID (uintCV)
  'Item not received'   // reason (stringAsciiCV)
);
```

## Network Configuration

```typescript
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export const getNetwork = () => {
  return NETWORK === 'mainnet' 
    ? new StacksMainnet() 
    : new StacksTestnet();
};
```

## Contract Configuration

```typescript
export const CONTRACT_ADDRESS = 'SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B';
export const CONTRACT_NAME = 'stack-mart';
export const TOKEN_CONTRACT = 'stackmart-tips';
export const NETWORK = 'mainnet';
```

## Type Safety

All contract interactions are fully typed with TypeScript:

```typescript
interface Listing {
  id: number;
  seller: string;
  price: number;
  royaltyBips: number;
  royaltyRecipient: string;
  nftContract?: string;
  tokenId?: number;
  licenseTerms?: string;
}

interface Auction {
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

// ... more types in types/marketplace.ts
```

## Utilities

### Contract Helpers

```typescript
import {
  toUintCV,
  toPrincipalCV,
  toContractPrincipalCV,
  toStringAsciiCV,
  toBufferCV,
  toBoolCV,
  toListCV,
  toOptionalCV,
  bipsToPercent,
  percentToBips,
  microStxToStx,
  stxToMicroStx,
  isValidStacksAddress,
  isValidContractPrincipal
} from './utils/contractHelpers';
```

### Formatting

```typescript
import { formatSTX, formatBips } from './utils/format';

formatSTX(1000000);  // "1.00 STX"
formatBips(500);     // "5.00%"
```

## Error Handling

All services include proper error handling:

```typescript
await openContractCall({
  // ... config
  onFinish: (data) => {
    console.log('Success:', data.txId);
  },
  onCancel: () => {
    console.log('User cancelled');
  }
});
```

## Post Conditions

Using `PostConditionMode.Allow` for flexibility:

```typescript
import { PostConditionMode } from '@stacks/transactions';

await openContractCall({
  // ... other params
  postConditionMode: PostConditionMode.Allow
});
```

## Usage Examples

### Complete Auction Flow

```typescript
// 1. Create auction
await createAuction(
  'SP000.nft-contract',
  1,
  1000000,
  5000000,
  144
);

// 2. Place bid
await placeBid(1, 2000000);

// 3. End auction
await endAuction(1, 'SP000.nft-contract');
```

### Complete Escrow Flow

```typescript
// 1. Buy with escrow
await buyListingEscrow(1);

// 2. Seller attests delivery
await attestDelivery(1, 'delivery-hash');

// 3. Buyer confirms receipt
await confirmReceipt(1);

// OR: Buyer rejects
await rejectDelivery(1, 'Item damaged');

// 4. Create dispute if needed
await createDispute(1, 'Item not as described');

// 5. Community stakes
await stakeOnDispute(1, 1000, true);

// 6. Community votes
await voteOnDispute(1, true);

// 7. Resolve dispute
await resolveDispute(1);
```

## Testing

All services can be tested with:

```bash
cd frontend
npm run dev
```

Visit the pages:
- http://localhost:5173/ - Home
- http://localhost:5173/auctions - Auctions
- http://localhost:5173/escrow - Escrow Management
- http://localhost:5173/bundles - Bundles & Packs

## Security

- All transactions require wallet signature
- No private keys in frontend code
- Read-only functions don't need authentication
- Admin functions check sender on-chain
- PostConditions for additional safety

## Performance

- Lazy loading of components
- Efficient state management with hooks
- Minimal re-renders with proper memoization
- Optimized bundle size

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

## Dependencies

```json
{
  "@stacks/connect": "^8.2.5",
  "@stacks/connect-react": "^23.1.5",
  "@stacks/network": "^7.3.1",
  "@stacks/transactions": "^7.3.1",
  "react": "^19.2.0",
  "react-router-dom": "^7.13.1"
}
```

## Next Steps

1. Add transaction history tracking
2. Implement search and filtering
3. Add notifications for events
4. Enhance UI/UX with animations
5. Add comprehensive testing suite
6. Deploy to production

## Resources

- [Stacks.js Documentation](https://docs.stacks.co/stacks-js)
- [@stacks/connect API](https://github.com/hirosystems/connect)
- [@stacks/transactions API](https://github.com/hirosystems/stacks.js)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
