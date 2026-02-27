import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const createDispute = async (escrowId: number, reason: string) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-dispute',
    functionArgs: [uintCV(escrowId), stringAsciiCV(reason)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Dispute created:', data.txId);
    },
    onCancel: () => {
      console.log('Dispute creation cancelled');
    }
  });
};

export const stakeOnDispute = async (disputeId: number, amount: number, side: boolean) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'stake-on-dispute',
    functionArgs: [uintCV(disputeId), uintCV(amount), boolCV(side)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Stake placed:', data.txId);
    },
    onCancel: () => {
      console.log('Stake cancelled');
    }
  });
};

export const voteOnDispute = async (disputeId: number, vote: boolean) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'vote-on-dispute',
    functionArgs: [uintCV(disputeId), boolCV(vote)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Vote cast:', data.txId);
    },
    onCancel: () => {
      console.log('Vote cancelled');
    }
  });
};

export const resolveDispute = async (disputeId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'resolve-dispute',
    functionArgs: [uintCV(disputeId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Dispute resolved:', data.txId);
    },
    onCancel: () => {
      console.log('Dispute resolution cancelled');
    }
  });
};

export const claimDisputeStake = async (disputeId: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'claim-dispute-stake',
    functionArgs: [uintCV(disputeId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Stake claimed:', data.txId);
    },
    onCancel: () => {
      console.log('Stake claim cancelled');
    }
  });
};
