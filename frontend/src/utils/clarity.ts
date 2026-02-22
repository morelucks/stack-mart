/**
 * Utility functions for Clarity value conversions
 */

import { 
  uintCV, 
  intCV, 
  stringAsciiCV, 
  stringUtf8CV, 
  principalCV, 
  boolCV,
  listCV,
  tupleCV,
  ClarityValue
} from '@stacks/transactions';

/**
 * Convert microSTX to STX
 */
export const microToStx = (micro: number): number => {
  return micro / 1000000;
};

/**
 * Convert STX to microSTX
 */
export const stxToMicro = (stx: number): number => {
  return Math.floor(stx * 1000000);
};

/**
 * Format STX amount for display
 */
export const formatStx = (micro: number): string => {
  return `${microToStx(micro).toFixed(6)} STX`;
};

/**
 * Create Clarity uint from number
 */
export const toUintCV = (value: number): ClarityValue => {
  return uintCV(value);
};

/**
 * Create Clarity int from number
 */
export const toIntCV = (value: number): ClarityValue => {
  return intCV(value);
};

/**
 * Create Clarity string-ascii from string
 */
export const toStringAsciiCV = (value: string): ClarityValue => {
  return stringAsciiCV(value);
};

/**
 * Create Clarity string-utf8 from string
 */
export const toStringUtf8CV = (value: string): ClarityValue => {
  return stringUtf8CV(value);
};

/**
 * Create Clarity principal from address
 */
export const toPrincipalCV = (address: string): ClarityValue => {
  return principalCV(address);
};

/**
 * Create Clarity bool from boolean
 */
export const toBoolCV = (value: boolean): ClarityValue => {
  return boolCV(value);
};

/**
 * Create Clarity list from array
 */
export const toListCV = (values: ClarityValue[]): ClarityValue => {
  return listCV(values);
};

/**
 * Create Clarity tuple from object
 */
export const toTupleCV = (data: Record<string, ClarityValue>): ClarityValue => {
  return tupleCV(data);
};

/**
 * Parse Clarity value to JavaScript value
 */
export const parseClarityValue = (value: any): any => {
  if (!value) return null;
  
  if (value.type === 'uint') {
    return parseInt(value.value);
  }
  
  if (value.type === 'int') {
    return parseInt(value.value);
  }
  
  if (value.type === 'bool') {
    return value.value;
  }
  
  if (value.type === 'string-ascii' || value.type === 'string-utf8') {
    return value.value;
  }
  
  if (value.type === 'principal') {
    return value.value;
  }
  
  if (value.type === 'list') {
    return value.value.map(parseClarityValue);
  }
  
  if (value.type === 'tuple') {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value.value)) {
      result[key] = parseClarityValue(val);
    }
    return result;
  }
  
  if (value.type === 'optional') {
    return value.value ? parseClarityValue(value.value) : null;
  }
  
  if (value.type === 'response') {
    if (value.value.success) {
      return { ok: parseClarityValue(value.value.value) };
    } else {
      return { err: parseClarityValue(value.value.value) };
    }
  }
  
  return value;
};

/**
 * Validate Stacks address format
 */
export const isValidStacksAddress = (address: string): boolean => {
  return /^(SP|ST)[0-9A-Z]{38,41}$/.test(address);
};

/**
 * Shorten address for display
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Format block height to estimated time
 */
export const blocksToTime = (blocks: number): string => {
  const minutes = blocks * 10; // ~10 minutes per block
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `~${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `~${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (price: number, discountPercent: number): number => {
  return Math.floor(price * discountPercent / 100);
};

/**
 * Calculate final price after discount
 */
export const applyDiscount = (price: number, discountPercent: number): number => {
  return price - calculateDiscount(price, discountPercent);
};
