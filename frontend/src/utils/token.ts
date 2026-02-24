export const formatTokenAmount = (microTokens: number): string => {
  return (microTokens / 1000000).toFixed(6);
};

export const microTokensToTokens = (microTokens: number): number => {
  return microTokens / 1000000;
};

export const tokensToMicroTokens = (tokens: number): number => {
  return Math.floor(tokens * 1000000);
};
