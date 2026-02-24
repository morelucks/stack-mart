export const formatSTX = (microSTX: number): string => {
  return (microSTX / 1000000).toFixed(2);
};

export const formatBips = (bips: number): string => {
  return (bips / 100).toFixed(2);
};

export const microSTXToSTX = (microSTX: number): number => {
  return microSTX / 1000000;
};

export const stxToMicroSTX = (stx: number): number => {
  return Math.floor(stx * 1000000);
};
