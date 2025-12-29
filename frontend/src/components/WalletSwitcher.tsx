import { useState } from 'react';
import { WalletButton } from './WalletButton';
import { AppKitConnectButton } from './AppKitConnectButton';
import { WalletKitButton } from './WalletKitButton';

type WalletOption = 'stacks' | 'appkit' | 'walletkit';

/**
 * Wallet Switcher Component
 * Allows users to switch between different wallet providers
 */
export const WalletSwitcher = () => {
  const [activeWallet, setActiveWallet] = useState<WalletOption>('stacks');

  const walletOptions: Array<{ value: WalletOption; label: string; icon: string }> = [
    { value: 'stacks', label: 'Stacks', icon: '⛓️' },
    { value: 'appkit', label: 'AppKit', icon: '🔌' },
    { value: 'walletkit', label: 'WalletKit', icon: '⚡' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        padding: '0.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-md)',
      }}>
        {walletOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveWallet(option.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: activeWallet === option.value 
                ? 'rgba(99, 102, 241, 0.3)' 
                : 'transparent',
              border: `1px solid ${activeWallet === option.value 
                ? 'rgba(99, 102, 241, 0.5)' 
                : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeWallet === 'stacks' && <WalletButton />}
        {activeWallet === 'appkit' && <AppKitConnectButton />}
        {activeWallet === 'walletkit' && <WalletKitButton />}
      </div>
    </div>
  );
};

