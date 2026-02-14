# StackMart Mainnet Deployment Guide

## Prerequisites

1. **STX for deployment fees** - Ensure your deployer wallet has sufficient STX (~5-10 STX recommended)
2. **Mainnet wallet** - A Stacks mainnet wallet with mnemonic phrase
3. **Clarinet installed** - Version 2.0+

## Setup

1. Configure your mainnet deployer account:
   ```bash
   # Edit settings/Mainnet.toml and add your mnemonic
   nano settings/Mainnet.toml
   ```

2. Verify contracts compile:
   ```bash
   clarinet check
   ```

## Deployment Steps

### Deploy contracts in order:

```bash
# 1. Deploy mock-nft (if needed for testing)
clarinet deployments generate --mainnet

# 2. Review the deployment plan
cat deployments/default.mainnet-plan.yaml

# 3. Execute deployment
clarinet deployments apply -p deployments/default.mainnet-plan.yaml --mainnet
```

## Manual Deployment (Alternative)

If you prefer manual control:

```bash
# Deploy stack-mart contract
stx deploy_contract stack-mart contracts/stack-mart.clar --network mainnet

# Deploy rewards-leaderboard
stx deploy_contract rewards-leaderboard contracts/rewards-leaderboard.clar --network mainnet

# Deploy sp-010 token
stx deploy_contract sp-010 contracts/sp-010.clar --network mainnet
```

## Post-Deployment

1. **Verify contracts on explorer:**
   - https://explorer.hiro.so/

2. **Initialize contracts:**
   - Set marketplace fee recipient
   - Configure initial parameters

3. **Update frontend:**
   - Update contract addresses in frontend/.env
   - Set `VITE_NETWORK=mainnet`
   - Set `VITE_CONTRACT_ADDRESS=<your_deployer_address>`

## Security Checklist

- [ ] Contracts audited
- [ ] Test suite passing (npm test)
- [ ] Testnet deployment tested
- [ ] Fee parameters reviewed
- [ ] Admin functions secured
- [ ] Backup mnemonic stored securely
- [ ] Monitor deployment transactions

## Contract Addresses (Update after deployment)

```
stack-mart: <address>.stack-mart
rewards-leaderboard: <address>.rewards-leaderboard
sp-010: <address>.sp-010
```
