export const truncateAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const isValidStacksAddress = (address: string): boolean => {
  return /^SP[0-9A-Z]{38,41}$/.test(address) || /^ST[0-9A-Z]{38,41}$/.test(address);
};

export const getExplorerUrl = (txId: string, network = 'mainnet'): string => {
  return `https://explorer.hiro.so/txid/${txId}?chain=${network}`;
};
