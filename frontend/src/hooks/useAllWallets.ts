import { useStacks } from './useStacks';
import { useAppKitIntegration } from './useAppKitIntegration';
import { useWalletKitHook } from './useWalletKit';

/**
 * Unified hook that aggregates all wallet connection states
 * Provides a single interface to check wallet connections across all providers
 */
export const useAllWallets = () => {
  const stacks = useStacks();
  const appKit = useAppKitIntegration();
  const walletKit = useWalletKitHook();

  const isAnyConnected = stacks.isConnected || appKit.isConnected || walletKit.isConnected;
  
  const connectedWallets = [
    stacks.isConnected && { type: 'stacks', address: stacks.userData?.profile?.stxAddress?.mainnet || stacks.userData?.profile?.stxAddress?.testnet },
    appKit.isConnected && { type: 'appkit', address: appKit.address },
    walletKit.isConnected && { type: 'walletkit', address: walletKit.address },
  ].filter(Boolean) as Array<{ type: string; address: string }>;

  return {
    // Individual wallet states
    stacks,
    appKit,
    walletKit,
    
    // Aggregated states
    isAnyConnected,
    connectedWallets,
    connectedCount: connectedWallets.length,
    
    // Helper methods
    getPrimaryAddress: () => {
      // Priority: Stacks > AppKit > WalletKit
      if (stacks.isConnected && stacks.userData?.profile?.stxAddress) {
        return stacks.userData.profile.stxAddress.mainnet || stacks.userData.profile.stxAddress.testnet;
      }
      if (appKit.isConnected && appKit.address) {
        return appKit.address;
      }
      if (walletKit.isConnected && walletKit.address) {
        return walletKit.address;
      }
      return null;
    },
  };
};

