import {
  ClarityValue,
  ClarityType,
  cvToValue,
  cvToString,
  cvToJSON,
  ResponseOkCV,
  ResponseErrorCV,
  OptionalCV,
  TupleCV,
  ListCV,
  UIntCV,
  IntCV,
  BufferCV,
  StringAsciiCV,
  StringUtf8CV,
  PrincipalCV,
  BooleanCV,
} from '@stacks/transactions';

/**
 * Utility functions for parsing Clarity values using @stacks/transactions
 */

/**
 * Parse UInt Clarity value to number
 */
export const parseUInt = (cv: ClarityValue): number => {
  if (cv.type !== ClarityType.UInt) {
    throw new Error('Expected UInt Clarity value');
  }
  return Number((cv as UIntCV).value);
};

/**
 * Parse Int Clarity value to number
 */
export const parseInt = (cv: ClarityValue): number => {
  if (cv.type !== ClarityType.Int) {
    throw new Error('Expected Int Clarity value');
  }
  return Number((cv as IntCV).value);
};

/**
 * Parse Boolean Clarity value
 */
export const parseBoolean = (cv: ClarityValue): boolean => {
  if (cv.type !== ClarityType.BoolTrue && cv.type !== ClarityType.BoolFalse) {
    throw new Error('Expected Boolean Clarity value');
  }
  return cv.type === ClarityType.BoolTrue;
};

/**
 * Parse Principal Clarity value to string
 */
export const parsePrincipal = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.PrincipalStandard && cv.type !== ClarityType.PrincipalContract) {
    throw new Error('Expected Principal Clarity value');
  }
  return cvToString(cv);
};

/**
 * Parse Buffer Clarity value to hex string
 */
export const parseBuffer = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.Buffer) {
    throw new Error('Expected Buffer Clarity value');
  }
  return Buffer.from((cv as BufferCV).buffer).toString('hex');
};

/**
 * Parse String ASCII Clarity value
 */
export const parseStringAscii = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.StringASCII) {
    throw new Error('Expected String ASCII Clarity value');
  }
  return (cv as StringAsciiCV).data;
};

/**
 * Parse String UTF8 Clarity value
 */
export const parseStringUtf8 = (cv: ClarityValue): string => {
  if (cv.type !== ClarityType.StringUTF8) {
    throw new Error('Expected String UTF8 Clarity value');
  }
  return (cv as StringUtf8CV).data;
};

/**
 * Parse Optional Clarity value
 */
export const parseOptional = <T>(
  cv: ClarityValue,
  parser: (value: ClarityValue) => T
): T | null => {
  if (cv.type === ClarityType.OptionalNone) {
    return null;
  }
  if (cv.type !== ClarityType.OptionalSome) {
    throw new Error('Expected Optional Clarity value');
  }
  return parser((cv as OptionalCV).value);
};

/**
 * Parse Response Clarity value
 */
export const parseResponse = <T, E>(
  cv: ClarityValue,
  okParser: (value: ClarityValue) => T,
  errParser: (value: ClarityValue) => E
): { ok: true; value: T } | { ok: false; value: E } => {
  if (cv.type === ClarityType.ResponseOk) {
    return { ok: true, value: okParser((cv as ResponseOkCV).value) };
  }
  if (cv.type === ClarityType.ResponseErr) {
    return { ok: false, value: errParser((cv as ResponseErrorCV).value) };
  }
  throw new Error('Expected Response Clarity value');
};

/**
 * Parse List Clarity value
 */
export const parseList = <T>(
  cv: ClarityValue,
  parser: (value: ClarityValue) => T
): T[] => {
  if (cv.type !== ClarityType.List) {
    throw new Error('Expected List Clarity value');
  }
  return (cv as ListCV).list.map(parser);
};

/**
 * Parse Tuple Clarity value
 */
export const parseTuple = (cv: ClarityValue): Record<string, any> => {
  if (cv.type !== ClarityType.Tuple) {
    throw new Error('Expected Tuple Clarity value');
  }
  
  const tuple = cv as TupleCV;
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(tuple.data)) {
    result[key] = cvToJSON(value);
  }
  
  return result;
};

/**
 * Parse listing data from Clarity tuple
 */
export const parseListing = (cv: ClarityValue) => {
  const tuple = parseTuple(cv);
  return {
    id: tuple.id,
    seller: tuple.seller,
    price: tuple.price,
    royaltyBips: tuple['royalty-bips'],
    royaltyRecipient: tuple['royalty-recipient'],
    nftContract: tuple['nft-contract'],
    tokenId: tuple['token-id'],
    licenseTerms: tuple['license-terms'],
  };
};

/**
 * Parse auction data from Clarity tuple
 */
export const parseAuction = (cv: ClarityValue) => {
  const tuple = parseTuple(cv);
  return {
    id: tuple.id,
    seller: tuple.seller,
    nftContract: tuple['nft-contract'],
    tokenId: tuple['token-id'],
    startPrice: tuple['start-price'],
    reservePrice: tuple['reserve-price'],
    currentBid: tuple['current-bid'],
    highestBidder: tuple['highest-bidder'],
    endBlock: tuple['end-block'],
    active: tuple.active,
  };
};

/**
 * Parse escrow data from Clarity tuple
 */
export const parseEscrow = (cv: ClarityValue) => {
  const tuple = parseTuple(cv);
  return {
    listingId: tuple['listing-id'],
    buyer: tuple.buyer,
    amount: tuple.amount,
    createdAtBlock: tuple['created-at-block'],
    state: tuple.state,
    timeoutBlock: tuple['timeout-block'],
    deliveryHash: tuple['delivery-hash'],
  };
};

/**
 * Parse dispute data from Clarity tuple
 */
export const parseDispute = (cv: ClarityValue) => {
  const tuple = parseTuple(cv);
  return {
    id: tuple.id,
    escrowId: tuple['escrow-id'],
    reason: tuple.reason,
    buyerStake: tuple['buyer-stake'],
    sellerStake: tuple['seller-stake'],
    resolved: tuple.resolved,
    winner: tuple.winner,
  };
};

/**
 * Parse reputation data from Clarity tuple
 */
export const parseReputation = (cv: ClarityValue) => {
  const tuple = parseTuple(cv);
  return {
    successfulSales: tuple['successful-sales'],
    failedSales: tuple['failed-sales'],
    totalRating: tuple['total-rating'],
    ratingCount: tuple['rating-count'],
    totalVolume: tuple['total-volume'],
  };
};

/**
 * Safe parse with error handling
 */
export const safeParse = <T>(
  cv: ClarityValue,
  parser: (value: ClarityValue) => T,
  defaultValue: T
): T => {
  try {
    return parser(cv);
  } catch (error) {
    console.error('Parse error:', error);
    return defaultValue;
  }
};
