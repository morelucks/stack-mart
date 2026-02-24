# Mainnet Deployment Record

## Deployment Information

**Date**: February 24, 2026
**Network**: Stacks Mainnet
**Deployer**: SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B

## Contract Details

**Contract Name**: stack-mart
**Contract Address**: SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B.stack-mart
**Transaction ID**: 20812c412c74929391a7303d43862a6143e15bd6ccf00c733fa1fd6846c26747
**Explorer**: https://explorer.hiro.so/txid/20812c412c74929391a7303d43862a6143e15bd6ccf00c733fa1fd6846c26747?chain=mainnet

## Deployment Costs

**Fee Paid**: 0.15 STX (150,000 microSTX)
**Nonce**: 138
**Confirmation Time**: ~10 minutes

## Contract Version

**Version**: 2.1.0
**Clarity Version**: 2
**Epoch**: 3.0

## Pre-Deployment Verification

✅ Contract syntax validated with `clarinet check`
✅ All type mismatches resolved
✅ Dynamic contract calls properly disabled
✅ Security audit completed
✅ Private keys secured in `.env` (gitignored)
✅ Dependencies installed

## Post-Deployment Verification

- [ ] Contract visible on explorer
- [ ] Read-only functions callable
- [ ] Test transaction on mainnet
- [ ] Frontend integration updated

## Notes

- NFT transfers must be handled separately (Clarity limitation)
- All escrow functions tested and working
- Auction system fully functional
- Bundle and wishlist features operational

## Rollback Plan

If issues are discovered:
1. Deploy fixed version with new contract name
2. Update frontend to point to new contract
3. Migrate critical data if necessary
4. Communicate changes to users

## Contact

For issues or questions regarding this deployment, refer to the project repository.
