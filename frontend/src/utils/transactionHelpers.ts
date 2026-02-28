import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  makeSTXTokenTransfer,
  estimateTransaction,
  StacksTransaction,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from '../config/contract';

/**
 * Advanced transaction utilities using @stacks/transactions
 */

/**
 * Get network instance
 */
export const getNetworkInstance = () => {
  return NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};

/**
 * Estimate transaction fee using @stacks/transactions
 */
export const estimateTransactionFee = async (
  transaction: StacksTransaction
): Promise<bigint> => {
  try {
    const network = getNetworkInstance();
    const fee = await estimateTransaction(transaction.payload, network);
    return fee;
  } catch (error) {
    console.error('Fee estimation failed:', error);
    return BigInt(1000); // Default fallback fee
  }
};

/**
 * Build contract call transaction using makeContractCall
 */
export const buildContractCallTransaction = async (params: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  senderKey: string;
  fee?: bigint;
  nonce?: bigint;
  postConditionMode?: PostConditionMode;
  postConditions?: any[];
  anchorMode?: AnchorMode;
}) => {
  const network = getNetworkInstance();

  const txOptions = {
    contractAddress: params.contractAddress,
    contractName: params.contractName,
    functionName: params.functionName,
    functionArgs: params.functionArgs,
    senderKey: params.senderKey,
    network,
    fee: params.fee,
    nonce: params.nonce,
    postConditionMode: params.postConditionMode || PostConditionMode.Allow,
    postConditions: params.postConditions || [],
    anchorMode: params.anchorMode || AnchorMode.Any,
  };

  return await makeContractCall(txOptions);
};

/**
 * Build STX transfer transaction using makeSTXTokenTransfer
 */
export const buildSTXTransferTransaction = async (params: {
  recipient: string;
  amount: bigint;
  senderKey: string;
  memo?: string;
  fee?: bigint;
  nonce?: bigint;
  anchorMode?: AnchorMode;
}) => {
  const network = getNetworkInstance();

  const txOptions = {
    recipient: params.recipient,
    amount: params.amount,
    senderKey: params.senderKey,
    network,
    memo: params.memo,
    fee: params.fee,
    nonce: params.nonce,
    anchorMode: params.anchorMode || AnchorMode.Any,
  };

  return await makeSTXTokenTransfer(txOptions);
};

/**
 * Broadcast transaction using broadcastTransaction
 */
export const broadcastTransactionToNetwork = async (
  transaction: StacksTransaction
): Promise<string> => {
  const network = getNetworkInstance();
  
  try {
    const result = await broadcastTransaction(transaction, network);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    return result.txid;
  } catch (error) {
    console.error('Broadcast failed:', error);
    throw error;
  }
};

/**
 * Get transaction serialization
 */
export const serializeTransaction = (transaction: StacksTransaction): string => {
  return transaction.serialize().toString('hex');
};

/**
 * Get transaction ID
 */
export const getTransactionId = (transaction: StacksTransaction): string => {
  return transaction.txid();
};

/**
 * Check if transaction is sponsored
 */
export const isSponsored = (transaction: StacksTransaction): boolean => {
  return transaction.auth.spendingCondition !== undefined;
};

/**
 * Get transaction anchor mode
 */
export const getAnchorMode = (transaction: StacksTransaction): AnchorMode => {
  return transaction.anchorMode;
};

/**
 * Validate transaction before broadcast
 */
export const validateTransaction = (transaction: StacksTransaction): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  try {
    // Check if transaction can be serialized
    transaction.serialize();
  } catch (error) {
    errors.push('Transaction serialization failed');
  }

  // Check if transaction has valid fee
  if (transaction.auth.spendingCondition?.fee === undefined) {
    errors.push('Transaction fee is missing');
  }

  // Check if transaction has valid nonce
  if (transaction.auth.spendingCondition?.nonce === undefined) {
    errors.push('Transaction nonce is missing');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
