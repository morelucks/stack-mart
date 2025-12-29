import { useNetworkSwitch } from '../hooks/useNetworkSwitch';
import { useAccount } from 'wagmi';

/**
 * Network Switcher Component
 * Allows users to switch between different EVM networks using AppKit
 */
export const NetworkSwitcher = () => {
  const { currentChain, supportedChains, switchToChain } = useNetworkSwitch();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <div style={{ 
        fontSize: '0.875rem', 
        color: 'rgba(255, 255, 255, 0.7)', 
        marginBottom: '0.75rem' 
      }}>
        Current Network: <strong style={{ color: 'white' }}>
          {currentChain?.name || 'Unknown'}
        </strong>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {supportedChains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchToChain(chain.id)}
            disabled={currentChain?.id === chain.id}
            style={{
              padding: '0.75rem',
              backgroundColor: currentChain?.id === chain.id
                ? 'rgba(99, 102, 241, 0.3)'
                : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${
                currentChain?.id === chain.id
                  ? 'rgba(99, 102, 241, 0.5)'
                  : 'rgba(255, 255, 255, 0.2)'
              }`,
              borderRadius: 'var(--radius-sm)',
              color: 'white',
              cursor: currentChain?.id === chain.id ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{chain.icon}</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{chain.name}</span>
            {currentChain?.id === chain.id && (
              <span style={{ 
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--success)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
              }}>
                Active
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

