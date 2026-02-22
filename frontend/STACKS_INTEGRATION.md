# Stacks Integration Guide

This guide explains how StackMart integrates with the Stacks blockchain using `@stacks/connect` and `@stacks/transactions`.

## Core Libraries

### @stacks/connect
Used for wallet connection and transaction signing through the user's wallet extension.

**Key Functions:**
- `connect()` - Connect to user's wallet
- `disconnect()` - Disconnect wallet
- `openContractCall()` - Open wallet to sign contract call
- `isConnected()` - Check connection status
- `getLocalStorage()` - Get user data from local storage

### @stacks/transactions
Used for building and broadcasting transactions.

**Key Functions:**
- `makeContractCall()` - Create contract call transaction
- `broadcastTransaction()` - Broadcast transaction to network
- `callReadOnlyFunction()` - Call read-only contract functions
- `cvToJSON()` - Convert Clarity values to JSON
- `uintCV()`, `stringAsciiCV()`, `principalCV()` - Create Clarity values

## Architecture

### useStacks Hook
Located in `/frontend/src/hooks/useStacks.ts`

Handles wallet connection state and provides:
- `isConnected` - Connection status
- `connectWallet()` - Connect wallet function
- `disconnectWallet()` - Disconnect function
- `userData` - User profile and address data
- `network` - Current network (mainnet/testnet)

### useContract Hook
Located in `/frontend/src/hooks/useContract.ts`

Provides all contract interaction functions:

**Read Functions:**
- `getListing(id)` - Get listing details
- `getEscrowStatus(listingId)` - Get escrow status
- `getAllListings(limit)` - Get all listings
- `getDispute(disputeId)` - Get dispute details
- `getBundle(bundleId)` - Get bundle details
- `getWishlist(principal)` - Get user wishlist
- `getPriceHistory(listingId)` - Get price history
- `getSellerReputation(principal)` - Get seller reputation
- `getBuyerReputation(principal)` - Get buyer reputation

**Write Functions:**
- `createListing(nftContract, nftId, price, title, description)` - Create new listing
- `buyListing(listingId, price)` - Purchase a listing
- `cancelListing(listingId)` - Cancel a listing
- `updateListingPrice(listingId, newPrice)` - Update listing price
- `createAuction(nftContract, nftId, startPrice, reservePrice, duration)` - Create auction
- `placeBid(auctionId, bidAmount)` - Place bid on auction
- `finalizeAuction(auctionId)` - Finalize auction
- `createBundle(listingIds, discountPercent)` - Create bundle
- `raiseDispute(escrowId, reason)` - Raise a dispute
- `voteOnDispute(disputeId, voteFor, stakeAmount)` - Vote on dispute
- `resolveDispute(disputeId)` - Resolve dispute
- `toggleWishlist(listingId)` - Add/remove from wishlist

## Usage Examples

### Basic Listing Creation

```typescript
import { useStacks } from '../hooks/useStacks';
import { useContract } from '../hooks/useContract';

function CreateListingComponent() {
  const { isConnected } = useStacks();
  const { createListing } = useContract();

  const handleCreate = async () => {
    if (!isConnected) {
      alert('Please connect wallet');
      return;
    }

    try {
      await createListing(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-contract',
        1,
        1000000, // 1 STX in microSTX
        'My NFT',
        'Description'
      );
      console.log('Listing created!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleCreate}>Create Listing</button>;
}
```

### Buying a Listing

```typescript
function BuyComponent({ listingId, price }: { listingId: number; price: number }) {
  const { isConnected } = useStacks();
  const { buyListing } = useContract();

  const handleBuy = async () => {
    if (!isConnected) return;

    try {
      await buyListing(listingId, price);
      console.log('Purchase initiated!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleBuy}>Buy Now</button>;
}
```

### Creating an Auction

```typescript
function CreateAuctionComponent() {
  const { isConnected } = useStacks();
  const { createAuction } = useContract();

  const handleCreate = async () => {
    if (!isConnected) return;

    try {
      await createAuction(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-contract',
        2,
        500000,   // 0.5 STX start price
        1000000,  // 1 STX reserve price
        144       // ~1 day duration (144 blocks)
      );
      console.log('Auction created!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleCreate}>Create Auction</button>;
}
```

### Reading Contract Data

```typescript
function ListingDisplay({ listingId }: { listingId: number }) {
  const { getListing } = useContract();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(listingId);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [listingId]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div>
      <h3>Listing #{listingId}</h3>
      <p>Price: {listing.price / 1000000} STX</p>
      <p>Seller: {listing.seller}</p>
    </div>
  );
}
```

## Transaction Flow

### Write Operations (using openContractCall)

1. User clicks button to perform action
2. Component calls hook function (e.g., `createListing()`)
3. Hook prepares transaction options with:
   - Contract address and name
   - Function name and arguments
   - Network configuration
   - Post conditions
4. `openContractCall()` opens wallet extension
5. User reviews and signs transaction in wallet
6. Transaction is broadcast to network
7. Callbacks handle success/cancel

### Read Operations (using callReadOnlyFunction)

1. Component calls hook function (e.g., `getListing()`)
2. Hook calls `callReadOnlyFunction()` with:
   - Contract details
   - Function name and arguments
   - Network configuration
3. Result is returned as Clarity value
4. `cvToJSON()` converts to JavaScript object
5. Component receives and displays data

## Post Conditions

Post conditions protect users by ensuring transactions only execute if certain conditions are met.

**PostConditionMode.Deny** - Strict mode, requires explicit post conditions
**PostConditionMode.Allow** - Permissive mode, allows any state changes

Use `Deny` mode for:
- Token transfers
- NFT transfers
- High-value operations

Use `Allow` mode for:
- Simple state updates
- Read-heavy operations
- Low-risk transactions

## Network Configuration

The app supports both mainnet and testnet:

```typescript
// In config/contract.ts
export const NETWORK = import.meta.env.VITE_STACKS_NETWORK || 'mainnet';
export const API_URL = NETWORK === 'mainnet' 
  ? 'https://api.hiro.so' 
  : 'https://api.testnet.hiro.so';
```

Set in `.env`:
```
VITE_STACKS_NETWORK=testnet
```

## Error Handling

All contract functions include try-catch blocks:

```typescript
try {
  await createListing(...);
  // Success handling
} catch (error) {
  console.error('Error:', error);
  // Error handling
}
```

Common errors:
- User rejects transaction
- Insufficient balance
- Contract error (e.g., listing not found)
- Network error

## Testing

Use the `StacksIntegrationExample` component to test all functions:

```typescript
import { StacksIntegrationExample } from './components/StacksIntegrationExample';

function App() {
  return <StacksIntegrationExample />;
}
```

## Best Practices

1. **Always check wallet connection** before calling write functions
2. **Use proper Clarity value types** (uintCV, stringAsciiCV, etc.)
3. **Handle errors gracefully** with user-friendly messages
4. **Show loading states** during transaction processing
5. **Validate inputs** before submitting transactions
6. **Use post conditions** for token/NFT transfers
7. **Cache read-only data** to reduce API calls
8. **Test on testnet** before mainnet deployment

## Resources

- [Stacks.js Documentation](https://docs.stacks.co/stacks-js)
- [@stacks/connect](https://github.com/hirosystems/connect)
- [@stacks/transactions](https://github.com/hirosystems/stacks.js/tree/main/packages/transactions)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
