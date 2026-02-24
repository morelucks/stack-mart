# StackMart Deployment Guide

## Prerequisites
- Node.js 18+
- Stacks wallet with STX for deployment fees
- Private key for deployment account

## Environment Setup

Create a `.env` file in the project root:

```bash
PRIVATE_KEY=your_private_key_here
STACKS_NETWORK=mainnet  # or testnet
FEE=150000  # in microSTX
```

## Deployment Steps

1. Install dependencies:
```bash
npm install @stacks/transactions @stacks/network
```

2. Verify contract syntax:
```bash
clarinet check
```

3. Deploy to mainnet:
```bash
node deploy.js
```

## Contract Fixes Applied

- Set explicit Clarity version 2 and epoch 3.0
- Fixed type mismatches in function parameters
- Added missing wishlists data map
- Disabled unsupported dynamic contract calls
- Fixed dispute stake refund logic
- Corrected match arm return types

## Security Notes

- Never commit `.env` file to version control
- `.env` is listed in `.gitignore`
- Use separate keys for testnet and mainnet
- Verify contract address after deployment

## Deployment Cost

Typical deployment fee: ~0.15 STX
Confirmation time: ~10 minutes
