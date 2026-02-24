# StackMart Tips Token Integration

## Overview
Complete integration of StackMart Tips (SMT) token with the frontend using @stacks/connect and @stacks/transactions.

## Token Details
- **Name**: StackMart Tips
- **Symbol**: SMT
- **Contract**: `SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B.stackmart-tips`
- **Standard**: SIP-010
- **Decimals**: 6
- **Total Supply**: 1,000,000,000 SMT

## Features Implemented

### 1. Token Services (services/token.ts)
- `getTokenBalance(address)` - Get user's SMT balance
- `getTokenName(address)` - Get token name
- `getTokenSymbol(address)` - Get token symbol
- `getTotalSupply(address)` - Get total supply
- `transferToken(amount, recipient, memo)` - Transfer SMT with @stacks/connect

### 2. Hooks
- `useTokenBalance()` - Real-time balance updates
- Automatic refresh on wallet change

### 3. Components
- `TokenBalance` - Display balance in header
- `TokenInfo` - Show token metadata
- `TokenTransferForm` - Send SMT with memo
- `TokenPage` - Complete token management page

### 4. Utilities
- `formatTokenAmount()` - Format micro-tokens to tokens
- `tokensToMicroTokens()` - Convert tokens to micro-tokens
- `microTokensToTokens()` - Convert micro-tokens to tokens

## Usage

### Check Balance
```tsx
import { useTokenBalance } from './hooks/useTokenBalance';

const { balance, loading } = useTokenBalance();
// balance in micro-tokens (1 SMT = 1,000,000 micro-tokens)
```

### Transfer Tokens
```tsx
import { transferToken } from './services/token';

await transferToken(
  1000000,  // 1 SMT
  'SP2...',  // Recipient
  'Payment for listing'  // Optional memo
);
```

### Display Balance
```tsx
import { TokenBalance } from './components/TokenBalance';

<TokenBalance />
```

## Navigation
- Main page: `/`
- Token page: `/token`
- Token link in homepage navigation

## Integration Points

### Header
- Shows SMT balance when wallet connected
- Real-time updates

### Token Page
- Token information card
- Transfer form
- About section

### HomePage
- Navigation link to token page
- Quick access to SMT features

## Transaction Flow

1. User connects wallet via @stacks/connect
2. Balance loads automatically
3. User initiates transfer
4. `openContractCall` opens wallet popup
5. User signs transaction
6. Transaction broadcast to network
7. Balance updates after confirmation

## Security
- All transactions require wallet signature
- No private keys in frontend
- PostConditionMode.Allow for flexibility
- Memo field limited to 34 characters

## Testing
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000/token to test token features.
