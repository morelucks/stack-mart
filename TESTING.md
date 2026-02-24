# Contract Testing Guide

## Running Tests

```bash
npm test
```

## Test Coverage

Run tests with coverage report:
```bash
npm run test:report
```

## Watch Mode

Auto-run tests on file changes:
```bash
npm run test:watch
```

## Key Test Areas

### Listing Management
- Creating listings with valid parameters
- Updating listing prices
- Canceling listings
- Buying listings with escrow

### Escrow System
- Funds held securely in contract
- Delivery attestation flow
- Dispute resolution
- Timeout handling

### Auction System
- Creating auctions with reserve prices
- Bidding with automatic refunds
- Auction finalization
- Winner determination

### Bundle System
- Creating bundles with discounts
- Purchasing multiple listings
- Discount calculation accuracy

### Wishlist System
- Adding/removing favorites
- List size limits
- User isolation

## Known Limitations

- NFT transfers must be tested separately (dynamic calls disabled)
- Some integration tests may need manual verification on testnet
