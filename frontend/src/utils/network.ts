import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from '../config/contract';

export const getNetwork = () => {
  return NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
};
