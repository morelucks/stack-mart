import { useAccount, useBalance } from 'wagmi';
import { useWalletKitLink } from '@walletkit/react-link';
import { useStacks } from './useStacks';
import { useEffect, useState } from 'react';

/**
 * Hook to get wallet balances across all connected wallets
 * Supports Stacks, AppKit (EVM), and WalletKit
 */
export const useWalletBalance = () => {
  const { address: appKitAddress, isConnected: appKitConnected } = useAccount();
  const { data: appKitBalance, isLoading: appKitBalanceLoading } = useBalance({
    address: appKitAddress,
    enabled: appKitConnected && !!appKitAddress,
  });
  
  const walletKit = useWalletKitLink() as any;
  const { userData, isConnected: stacksConnected } = useStacks();
  
  const [walletKitBalance, setWalletKitBalance] = useState<string | null>(null);
  const [stacksBalance, setStacksBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch WalletKit balance
  useEffect(() => {
    const fetchWalletKitBalance = async () => {
      if (walletKit?.isConnected && walletKit?.address) {
        setIsLoading(true);
        try {
          // WalletKit balance fetching (if available)
          const balance = await walletKit.getBalance?.();
          if (balance) {
            setWalletKitBalance(balance);
          }
        } catch (error) {
          console.error('Error fetching WalletKit balance:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setWalletKitBalance(null);
      }
    };

    fetchWalletKitBalance();
  }, [walletKit?.isConnected, walletKit?.address]);

  // Fetch Stacks balance
  useEffect(() => {
    const fetchStacksBalance = async () => {
      if (stacksConnected && userData?.profile?.stxAddress?.mainnet) {
        setIsLoading(true);
        try {
          const address = userData.profile.stxAddress.mainnet;
          const response = await fetch(
            `https://api.hiro.so/v2/accounts/${address}?proof=0`
          );
          if (response.ok) {
            const data = await response.json();
            const balance = (data.balance / 1000000).toFixed(6); // Convert microSTX to STX
            setStacksBalance(balance);
          }
        } catch (error) {
          console.error('Error fetching Stacks balance:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setStacksBalance(null);
      }
    };

    fetchStacksBalance();
  }, [stacksConnected, userData]);

  return {
    // AppKit balance (EVM chains)
    appKitBalance: appKitBalance ? {
      value: appKitBalance.value,
      formatted: appKitBalance.formatted,
      symbol: appKitBalance.symbol,
    } : null,
    appKitBalanceLoading,
    
    // WalletKit balance
    walletKitBalance,
    
    // Stacks balance
    stacksBalance,
    
    // Aggregated
    isLoading: isLoading || appKitBalanceLoading,
    hasAnyBalance: !!(appKitBalance || walletKitBalance || stacksBalance),
  };
};

