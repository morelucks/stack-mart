# StackMart Frontend

React + TypeScript frontend for StackMart decentralized marketplace.

## Features

✅ **Wallet Integration** - @stacks/connect for authentication
✅ **Contract Calls** - @stacks/transactions for blockchain interaction
✅ **Listing Management** - Create, update, buy listings
✅ **Wishlist System** - Favorite and track listings
✅ **Admin Panel** - Marketplace fee management
✅ **Reputation System** - Seller ratings and success rates
✅ **Responsive UI** - Mobile-friendly design

## Quick Start

```bash
npm install
npm run dev
```

## Environment

No environment variables needed - contract address is hardcoded for mainnet.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **@stacks/connect** - Wallet connection
- **@stacks/transactions** - Contract calls
- **React Router** - Navigation
- **Tailwind CSS** - Styling

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── services/       # Contract interaction
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
├── config/         # Configuration
└── App.tsx         # Main app component
```

## Key Files

- `services/listing.ts` - Listing write functions
- `services/wishlist.ts` - Wishlist functions
- `services/read.ts` - Read-only functions
- `hooks/useWallet.ts` - Wallet state
- `hooks/useListing.ts` - Listing data
- `config/contract.ts` - Contract address

## Usage

### Connect Wallet
```tsx
import { ConnectWalletButton } from './components/ConnectWalletButton';

<ConnectWalletButton />
```

### Create Listing
```tsx
import { createListing } from './services/listing';

await createListing(1000000, 500, recipientAddress);
```

### Buy Listing
```tsx
import { buyListing } from './services/listing';

await buyListing(listingId);
```

### Read Data
```tsx
import { getListing } from './services/read';

const listing = await getListing(listingId, userAddress);
```

## Components

All components are fully typed and documented. See `INTEGRATION_GUIDE.md` for details.

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment

```bash
npm run build
# Deploy dist/ folder to your hosting
```

## Contract Integration

Contract: `SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B.stack-mart`
Network: Stacks Mainnet

All transactions are signed via user's wallet. No private keys in frontend.
