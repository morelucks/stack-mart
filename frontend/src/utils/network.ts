import { StacksMainnet as STACKS_MAINNET, StacksTestnet as STACKS_TESTNET } from '@stacks/network';
import { NETWORK } from '../config/contract';

export const getNetwork = () => {
  return NETWORK === 'mainnet' ? new STACKS_MAINNET() : new STACKS_TESTNET();
};
