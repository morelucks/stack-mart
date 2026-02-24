import { fetchCallReadOnlyFunction as callReadOnlyFunction, cvToJSON, principalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, TOKEN_CONTRACT } from '../config/contract';
import { getNetwork } from '../utils/network';

export const getTokenBalance = async (address: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: TOKEN_CONTRACT,
    functionName: 'get-balance',
    functionArgs: [principalCV(address)],
    senderAddress: address
  });

  return cvToJSON(result);
};

export const getTokenName = async (senderAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: TOKEN_CONTRACT,
    functionName: 'get-name',
    functionArgs: [],
    senderAddress
  });

  return cvToJSON(result);
};

export const getTokenSymbol = async (senderAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: TOKEN_CONTRACT,
    functionName: 'get-symbol',
    functionArgs: [],
    senderAddress
  });

  return cvToJSON(result);
};

export const getTotalSupply = async (senderAddress: string) => {
  const result = await callReadOnlyFunction({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: TOKEN_CONTRACT,
    functionName: 'get-total-supply',
    functionArgs: [],
    senderAddress
  });

  return cvToJSON(result);
};
