import {
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
  FungibleConditionCode,
  PostCondition,
  createAssetInfo,
  makeStandardFungiblePostCondition,
} from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';

/**
 * Post condition builders using @stacks/transactions
 * Ensures transaction safety with explicit conditions
 */

/**
 * Create post condition for STX transfer from user
 */
export const createSTXTransferPostCondition = (
  senderAddress: string,
  amount: bigint
): PostCondition => {
  return makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amount
  );
};

/**
 * Create post condition for STX transfer with minimum amount
 */
export const createSTXMinimumPostCondition = (
  senderAddress: string,
  minAmount: bigint
): PostCondition => {
  return makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.GreaterEqual,
    minAmount
  );
};

/**
 * Create post condition for STX transfer with maximum amount
 */
export const createSTXMaximumPostCondition = (
  senderAddress: string,
  maxAmount: bigint
): PostCondition => {
  return makeStandardSTXPostCondition(
    senderAddress,
    FungibleConditionCode.LessEqual,
    maxAmount
  );
};

/**
 * Create post condition for contract STX transfer
 */
export const createContractSTXPostCondition = (
  amount: bigint,
  code: FungibleConditionCode = FungibleConditionCode.Equal
): PostCondition => {
  return makeContractSTXPostCondition(
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
    code,
    amount
  );
};

/**
 * Create post condition for fungible token transfer
 */
export const createTokenTransferPostCondition = (
  senderAddress: string,
  tokenContract: string,
  tokenName: string,
  amount: bigint
): PostCondition => {
  const [contractAddress, contractName] = tokenContract.split('.');
  
  const assetInfo = createAssetInfo(
    contractAddress,
    contractName,
    tokenName
  );

  return makeStandardFungiblePostCondition(
    senderAddress,
    FungibleConditionCode.Equal,
    amount,
    assetInfo
  );
};

/**
 * Create post conditions for listing purchase
 */
export const createListingPurchasePostConditions = (
  buyerAddress: string,
  price: bigint,
  fee: bigint
): PostCondition[] => {
  const totalAmount = price + fee;
  
  return [
    makeStandardSTXPostCondition(
      buyerAddress,
      FungibleConditionCode.Equal,
      totalAmount
    ),
  ];
};

/**
 * Create post conditions for auction bid
 */
export const createAuctionBidPostConditions = (
  bidderAddress: string,
  bidAmount: bigint
): PostCondition[] => {
  return [
    makeStandardSTXPostCondition(
      bidderAddress,
      FungibleConditionCode.Equal,
      bidAmount
    ),
  ];
};

/**
 * Create post conditions for escrow purchase
 */
export const createEscrowPostConditions = (
  buyerAddress: string,
  escrowAmount: bigint
): PostCondition[] => {
  return [
    makeStandardSTXPostCondition(
      buyerAddress,
      FungibleConditionCode.Equal,
      escrowAmount
    ),
  ];
};

/**
 * Create post conditions for bundle purchase
 */
export const createBundlePurchasePostConditions = (
  buyerAddress: string,
  totalPrice: bigint,
  discount: bigint
): PostCondition[] => {
  const finalPrice = totalPrice - discount;
  
  return [
    makeStandardSTXPostCondition(
      buyerAddress,
      FungibleConditionCode.Equal,
      finalPrice
    ),
  ];
};

/**
 * Create post conditions for dispute stake
 */
export const createDisputeStakePostConditions = (
  stakerAddress: string,
  stakeAmount: bigint
): PostCondition[] => {
  return [
    makeStandardSTXPostCondition(
      stakerAddress,
      FungibleConditionCode.Equal,
      stakeAmount
    ),
  ];
};

/**
 * Helper to convert microSTX to bigint
 */
export const microStxToBigInt = (microStx: number): bigint => {
  return BigInt(microStx);
};

/**
 * Helper to calculate marketplace fee
 */
export const calculateMarketplaceFee = (
  price: bigint,
  feeBips: number
): bigint => {
  return (price * BigInt(feeBips)) / BigInt(10000);
};
