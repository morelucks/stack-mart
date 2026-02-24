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

export const transferToken = async (amount: number, recipient: string, memo?: string) => {
  const { openContractCall } = await import('@stacks/connect');
  const { uintCV, principalCV, someCV, bufferCV, PostConditionMode } = await import('@stacks/transactions');
  
  const functionArgs = memo 
    ? [uintCV(amount), principalCV(recipient), someCV(bufferCV(Buffer.from(memo)))]
    : [uintCV(amount), principalCV(recipient), someCV(bufferCV(Buffer.from('')))];

  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: TOKEN_CONTRACT,
    functionName: 'transfer',
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Token transfer:', data.txId);
    }
  });
};
