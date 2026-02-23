# Stacks Integration Quick Reference

## Import Statements

```typescript
// For read operations
import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// For write operations
import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  principalCV, 
  boolCV, 
  listCV,
  AnchorMode, 
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode
} from '@stacks/transactions';
```

## Read-Only Function Call

```typescript
const result = await callReadOnlyFunction({
  contractAddress: CONTRACT_ID.split('.')[0],
  contractName: CONTRACT_ID.split('.')[1],
  functionName: 'get-listing',
  functionArgs: [uintCV(listingId)],
  network: STACKS_MAINNET,
  senderAddress: CONTRACT_ID.split('.')[0],
});
const data = cvToJSON(result);
```

## Write Function Call (No Post Conditions)

```typescript
await openContractCall({
  network: STACKS_MAINNET,
  anchorMode: AnchorMode.Any,
  contractAddress: CONTRACT_ID.split('.')[0],
  contractName: CONTRACT_ID.split('.')[1],
  functionName: 'toggle-wishlist',
  functionArgs: [uintCV(listingId)],
  postConditionMode: PostConditionMode.Allow,
  onFinish: (data) => console.log('Success:', data),
  onCancel: () => console.log('Cancelled'),
});
```

## Write Function Call (With STX Post Conditions)

```typescript
const postConditions = [
  makeStandardSTXPostCondition(
    userAddress,
    FungibleConditionCode.Equal,
    amountInMicroStx
  )
];

await openContractCall({
  network: STACKS_MAINNET,
  anchorMode: AnchorMode.Any,
  contractAddress: CONTRACT_ID.split('.')[0],
  contractName: CONTRACT_ID.split('.')[1],
  functionName: 'buy-listing',
  functionArgs: [uintCV(listingId)],
  postConditions,
  postConditionMode: PostConditionMode.Deny,
  onFinish: (data) => console.log('Success:', data),
  onCancel: () => console.log('Cancelled'),
});
```

## Clarity Value Conversions

```typescript
// JavaScript to Clarity
uintCV(123)                    // uint
stringAsciiCV("hello")         // string-ascii
principalCV("SP...")           // principal
boolCV(true)                   // bool
listCV([uintCV(1), uintCV(2)]) // list

// Clarity to JavaScript
const jsValue = cvToJSON(clarityValue);
```

## Hook Pattern

```typescript
import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useMyHook = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const myFunction = useCallback(async (id: number) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'my-function',
        functionArgs: [uintCV(id)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      return cvToJSON(result);
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }, [network]);

  return { myFunction };
};
```

## Component Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { useMyHook } from '../hooks/useMyHook';

export const MyComponent: React.FC = () => {
  const { myFunction } = useMyHook();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await myFunction(1);
      setData(result);
    };
    fetchData();
  }, [myFunction]);

  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
};
```

## Available Hooks

### Read Hooks
- `useListings()` - Fetch listings
- `useReputation()` - Get user reputation
- `useAuctions()` - Get auction data
- `useEscrow()` - Get escrow status
- `useBundles()` - Get bundle data
- `useDisputes()` - Get dispute data
- `usePriceHistoryQuery()` - Get price history

### Write Hooks
- `useCreateListing()` - Create listing
- `useBuyListing()` - Buy listing
- `useCancelListing()` - Cancel listing
- `usePlaceBid()` - Place auction bid
- `useRaiseDispute()` - Raise dispute
- `useVoteDispute()` - Vote on dispute
- `useCreateBundle()` - Create bundle
- `useWishlistToggle()` - Toggle wishlist
- `useUpdatePrice()` - Update price
- `useCreateAuction()` - Create auction
- `useFinalizeAuction()` - Finalize auction

### Utility Hooks
- `useTransactionState()` - Track transaction state
- `useTransactionMonitor()` - Monitor transaction status

## Common Patterns

### STX Amount Conversion
```typescript
// STX to microSTX (for contract calls)
const microStx = stxAmount * 1_000_000;

// microSTX to STX (for display)
const stx = microStx / 1_000_000;
```

### Error Handling
```typescript
try {
  await myContractCall();
} catch (error: any) {
  console.error('Transaction failed:', error.message);
  // Show user-friendly error
}
```

### Transaction Monitoring
```typescript
import { useTransactionMonitor } from '../hooks/useTransactionMonitor';

const [txId, setTxId] = useState<string | null>(null);
const status = useTransactionMonitor(txId);

// In openContractCall onFinish:
onFinish: (data) => setTxId(data.txId)
```

## Post Condition Codes

```typescript
FungibleConditionCode.Equal        // Exactly this amount
FungibleConditionCode.Greater      // More than this amount
FungibleConditionCode.GreaterEqual // At least this amount
FungibleConditionCode.Less         // Less than this amount
FungibleConditionCode.LessEqual    // At most this amount
```

## Anchor Modes

```typescript
AnchorMode.OnChainOnly  // Must be in a block
AnchorMode.OffChainOnly // Microblock only
AnchorMode.Any          // Either (recommended)
```

## Post Condition Modes

```typescript
PostConditionMode.Allow // Allow if post conditions pass or are missing
PostConditionMode.Deny  // Deny if post conditions don't match exactly
```

## Configuration

```typescript
// frontend/src/config/contract.ts
export const CONTRACT_ID = 'SP...contract-name';
export const NETWORK = process.env.VITE_NETWORK || 'testnet';
export const API_URL = 'https://api.testnet.hiro.so';
```

## Testing Checklist

- [ ] Read operations return correct data
- [ ] Write operations trigger wallet popup
- [ ] Post conditions prevent unauthorized transfers
- [ ] Transaction status updates correctly
- [ ] Error states display properly
- [ ] Loading states show during async operations
- [ ] Network switching works (mainnet/testnet)
