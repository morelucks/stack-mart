# Contract Architecture

## Overview
StackMart is a decentralized NFT marketplace built on Stacks blockchain using Clarity smart contracts.

## Core Components

### 1. Listing Management
- Create, update, and cancel listings
- Support for NFT metadata and licensing terms
- Price history tracking
- Category and tag system

### 2. Escrow System
- Secure fund holding during transactions
- Delivery attestation mechanism
- Timeout-based automatic resolution
- State machine: pending → delivered → confirmed/disputed

### 3. Auction System
- English auction with reserve prices
- Automatic bid refunds
- Time-based auction expiry
- Winner determination logic

### 4. Bundle System
- Multi-listing purchases with discounts
- Batch escrow creation
- Discount calculation in basis points

### 5. Dispute Resolution
- Community-based voting with stakes
- Weighted resolution based on stake amounts
- Automatic refunds for winning voters

### 6. Reputation System
- Transaction success/failure tracking
- Rating aggregation
- Total volume metrics
- Seller reputation scores

### 7. Wishlist System
- User favorites tracking
- Like count per listing
- Maximum 50 items per user

## Data Structures

### Maps
- `listings`: Core listing data
- `escrows`: Transaction escrow state
- `auctions`: Auction details
- `bundles-v2`: Bundle configurations
- `wishlists`: User favorites
- `reputation`: User reputation metrics
- `dispute-stakes`: Dispute voting stakes

### Variables
- `next-id`: Listing ID counter
- `next-auction-id`: Auction ID counter
- `next-bundle-id`: Bundle ID counter
- `admin`: Contract administrator
- `paused`: Emergency pause state
- `marketplace-fee-bips`: Fee in basis points
- `fee-recipient`: Fee collection address

## Security Model

### Access Control
- Admin-only functions for emergency operations
- Seller-only functions for listing management
- Buyer verification for purchases
- Stake-based dispute participation

### Fund Safety
- All STX held in contract escrow
- No direct fund transfers without verification
- Timeout-based automatic resolution
- Dispute mechanism for conflicts

## Limitations

### Clarity Constraints
- No dynamic contract calls (NFT transfers external)
- Fixed-size lists and strings
- No floating-point arithmetic (use basis points)
- No recursion (use fold for iteration)

### Design Decisions
- NFT transfers handled separately from marketplace
- Maximum 50 wishlisted items per user
- Maximum 10 items per bundle
- Fixed marketplace fee structure

## Future Enhancements
- Multi-sig admin controls
- Advanced royalty splitting
- Cross-chain NFT support
- Enhanced search and filtering
