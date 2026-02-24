# Contract Fixes Changelog

## Version 2.1.0 - 2026-02-24

### Breaking Changes
- Dynamic NFT contract calls disabled (Clarity limitation)
- NFT transfers must now be handled separately from marketplace transactions

### Bug Fixes
- Fixed description parameter type mismatch (1000 → 500 chars)
- Fixed tags list size mismatch (10 → 5 items)
- Fixed wishlist max length (100 → 50 items)
- Fixed dispute stake refund accessing wrong field
- Fixed match arm return type inconsistency in bundle escrow

### Features
- Added wishlists data map for user favorites
- Set explicit Clarity version 2 for better compatibility

### Technical Improvements
- Removed duplicate constant definitions
- Removed duplicate data map definitions
- Improved type safety across all functions
- Better error handling in match expressions

### Security
- All dynamic contract calls properly commented out
- No security vulnerabilities introduced
- Maintains escrow safety guarantees

### Deployment
- Successfully deployed to Stacks mainnet
- Contract address: SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B.stack-mart
- Transaction: 20812c412c74929391a7303d43862a6143e15bd6ccf00c733fa1fd6846c26747
