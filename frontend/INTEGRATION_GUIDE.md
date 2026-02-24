# Frontend Integration Guide

## Overview
Complete integration of StackMart smart contract with React frontend using @stacks/connect and @stacks/transactions.

## Contract Configuration
- **Address**: `SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B`
- **Name**: `stack-mart`
- **Network**: Mainnet

## Key Features Implemented

### 1. Wallet Connection
- `@stacks/connect` for wallet authentication
- Connect/disconnect functionality
- User session management
- Address display in header

### 2. Listing Management
- Create listings with price and royalty
- Update listing prices (seller only)
- Buy listings with STX transfer
- View listing details

### 3. Wishlist System
- Toggle wishlist for any listing
- View user's wishlist
- Like count tracking

### 4. Admin Functions
- Set marketplace fee (admin only)
- Fee displayed in basis points

### 5. Read-Only Functions
- Get listing data
- Get wishlist
- Get seller reputation
- All using `callReadOnlyFunction`

## Components

### Core Components
- `CreateListingForm` - Create new listings
- `EnhancedListingCard` - Display listing with all actions
- `BuyButton` - Purchase listings
- `WishlistButton` - Toggle favorites
- `UpdatePriceForm` - Update prices (sellers)

### UI Components
- `Header` - Navigation with wallet status
- `LoadingSpinner` - Loading states
- `ErrorMessage` - Error handling
- `PriceDisplay` - Format STX amounts
- `AddressDisplay` - Truncate addresses
- `TransactionLink` - Explorer links
- `ReputationBadge` - Seller ratings

### Pages
- `HomePage` - Main marketplace with tabs
- `ListingDetail` - Individual listing view
- `MarketplacePage` - Grid of listings

## Hooks

### Custom Hooks
- `useWallet` - Wallet connection state
- `useListing` - Fetch listing data
- Automatic refresh on wallet change

## Services

### Write Functions (services/listing.ts)
- `createListing(price, royalty, recipient)`
- `updateListingPrice(id, newPrice)`
- `buyListing(id)`

### Write Functions (services/wishlist.ts)
- `toggleWishlist(listingId)`

### Read Functions (services/read.ts)
- `getListing(id, senderAddress)`
- `getWishlist(userAddress)`
- `getSellerReputation(userAddress)`

## Utilities

### Format (utils/format.ts)
- `formatSTX(microSTX)` - Convert to STX
- `formatBips(bips)` - Convert to percentage
- `stxToMicroSTX(stx)` - Convert to microSTX

### Address (utils/address.ts)
- `truncateAddress(address)` - Shorten display
- `isValidStacksAddress(address)` - Validation
- `getExplorerUrl(txId)` - Explorer links

### Network (utils/network.ts)
- `getNetwork()` - Get mainnet/testnet instance

## Usage Example

```tsx
import { createListing } from './services/listing';
import { useWallet } from './hooks/useWallet';

function MyComponent() {
  const { address, isConnected } = useWallet();

  const handleCreate = async () => {
    await createListing(
      1000000, // 1 STX in microSTX
      500,     // 5% royalty
      address  // Recipient
    );
  };

  return (
    <button onClick={handleCreate} disabled={!isConnected}>
      Create Listing
    </button>
  );
}
```

## Transaction Flow

1. User connects wallet via `@stacks/connect`
2. User initiates action (create, buy, update)
3. `openContractCall` opens wallet popup
4. User signs transaction
5. Transaction broadcast to network
6. `onFinish` callback handles success
7. UI updates with new data

## Security

- All transactions require wallet signature
- PostConditionMode set to Allow
- No private keys in frontend
- Read-only functions don't require auth
- Admin functions check sender address

## Testing

Run the app:
```bash
cd frontend
npm run dev
```

Connect wallet and test:
1. Create a listing
2. View in marketplace
3. Add to wishlist
4. Update price (if owner)
5. Buy listing (if not owner)
