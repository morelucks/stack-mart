import { openContractCall } from '@stacks/connect';
import { uintCV, contractPrincipalCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const createAuction = async (
  nftContract: string,
  tokenId: number,
  startPrice: number,
  reservePrice: number,
  duration: number
) => {
  const functionArgs = [
    contractPrincipalCV(nftContract.split('.')[0], nftContract.split('.')[1]),
    uintCV(tokenId),
    uintCV(startPrice),
    uintCV(reservePrice),
    uintCV(duration)
  ];

  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-auction',
    functionArgs,
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Auction created:', data.txId);
    },
    onCancel: () => {
      console.log('Auction creation cancelled');
    }
  });
};

export const placeBid = async (auctionId: number, amount: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'place-bid',
    functionArgs: [uintCV(auctionId), uintCV(amount)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Bid placed:', data.txId);
    },
    onCancel: () => {
      console.log('Bid cancelled');
    }
  });
};

export const endAuction = async (auctionId: number, nftContract: string) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'end-auction',
    functionArgs: [
      uintCV(auctionId),
      contractPrincipalCV(nftContract.split('.')[0], nftContract.split('.')[1])
    ],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Auction ended:', data.txId);
    },
    onCancel: () => {
      console.log('End auction cancelled');
    }
  });
};
