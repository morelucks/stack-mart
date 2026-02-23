import { 
  uintCV, 
  stringAsciiCV, 
  principalCV, 
  boolCV, 
  listCV,
  tupleCV,
  someCV,
  noneCV,
  cvToJSON,
  ClarityValue
} from '@stacks/transactions';

export const clarityHelpers = {
  // Convert JS values to Clarity values
  toUint: (value: number) => uintCV(value),
  toString: (value: string) => stringAsciiCV(value),
  toPrincipal: (address: string) => principalCV(address),
  toBool: (value: boolean) => boolCV(value),
  toList: (values: ClarityValue[]) => listCV(values),
  toTuple: (data: Record<string, ClarityValue>) => tupleCV(data),
  toSome: (value: ClarityValue) => someCV(value),
  toNone: () => noneCV(),

  // Convert Clarity values to JS
  fromClarity: (value: ClarityValue) => cvToJSON(value),

  // Common conversions
  microStxToStx: (microStx: number) => microStx / 1_000_000,
  stxToMicroStx: (stx: number) => Math.floor(stx * 1_000_000),
};

export default clarityHelpers;
