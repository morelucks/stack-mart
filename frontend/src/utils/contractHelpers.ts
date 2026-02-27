import { 
  uintCV, 
  principalCV, 
  contractPrincipalCV, 
  stringAsciiCV, 
  bufferCV, 
  boolCV, 
  listCV,
  someCV,
  noneCV,
  ClarityValue
} from '@stacks/transactions';

/**
 * Helper functions for @stacks/transactions Clarity value conversions
 */

export const toUintCV = (value: number): ClarityValue => uintCV(value);

export const toPrincipalCV = (address: string): ClarityValue => principalCV(address);

export const toContractPrincipalCV = (contractId: string): ClarityValue => {
  const [address, name] = contractId.split('.');
  return contractPrincipalCV(address, name);
};

export const toStringAsciiCV = (value: string): ClarityValue => stringAsciiCV(value);

export const toBufferCV = (value: string | Buffer): ClarityValue => {
  const buffer = typeof value === 'string' ? Buffer.from(value, 'hex') : value;
  return bufferCV(buffer);
};

export const toBoolCV = (value: boolean): ClarityValue => boolCV(value);

export const toListCV = (values: ClarityValue[]): ClarityValue => listCV(values);

export const toOptionalCV = (value: ClarityValue | null): ClarityValue => {
  return value ? someCV(value) : noneCV();
};

/**
 * Convert basis points to percentage
 */
export const bipsToPercent = (bips: number): number => bips / 100;

/**
 * Convert percentage to basis points
 */
export const percentToBips = (percent: number): number => Math.round(percent * 100);

/**
 * Format microSTX to STX
 */
export const microStxToStx = (microStx: number): number => microStx / 1_000_000;

/**
 * Format STX to microSTX
 */
export const stxToMicroStx = (stx: number): number => Math.round(stx * 1_000_000);

/**
 * Parse contract principal from string
 */
export const parseContractPrincipal = (contractId: string): { address: string; name: string } => {
  const [address, name] = contractId.split('.');
  if (!address || !name) {
    throw new Error('Invalid contract principal format. Expected: ADDRESS.CONTRACT-NAME');
  }
  return { address, name };
};

/**
 * Validate Stacks address
 */
export const isValidStacksAddress = (address: string): boolean => {
  return /^S[TPMN][0-9A-Z]{38,40}$/.test(address);
};

/**
 * Validate contract principal
 */
export const isValidContractPrincipal = (contractId: string): boolean => {
  const parts = contractId.split('.');
  return parts.length === 2 && isValidStacksAddress(parts[0]) && parts[1].length > 0;
};
