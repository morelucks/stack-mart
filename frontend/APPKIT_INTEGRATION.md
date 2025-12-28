# Reown AppKit Integration

This project uses Reown AppKit (formerly WalletConnect AppKit) for modern wallet connection UI alongside Stacks Connect for Stacks-specific transactions.

## Features

- **Modern Wallet UI**: AppKit provides a beautiful, modern wallet connection interface
- **Multi-Wallet Support**: Supports multiple EVM wallets through WalletConnect
- **Email & Social Login**: Users can connect via email or social accounts
- **Hybrid Approach**: Stacks transactions still use @stacks/connect for native Stacks support
- **Wagmi Integration**: Uses Wagmi for EVM chain interactions

## Configuration

The AppKit configuration is in `src/config/appkit.ts`. You need to:

1. Get a Project ID from [Reown Cloud](https://cloud.reown.com)
2. Set it in your `.env` file:
   ```
   VITE_REOWN_PROJECT_ID=your_project_id_here
   ```

## Usage

### Basic Hook Usage

The `useStacks` hook has been enhanced to support both AppKit and Stacks Connect:

```typescript
const { isConnected, connectWallet, appKitAddress, isAppKitConnected } = useStacks();
```

### AppKit Integration Hook

Use `useAppKitIntegration` for AppKit-specific functionality:

```typescript
import { useAppKitIntegration } from '../hooks/useAppKitIntegration';

const { open, close, address, isConnected, chain } = useAppKitIntegration();
```

### Components

- `WalletButton`: Hybrid button supporting both Stacks and AppKit wallets
- `AppKitConnectButton`: Dedicated AppKit connect button with built-in UI

## Network Support

Currently configured for:
- Ethereum Mainnet (Chain ID: 1)
- Sepolia Testnet (Chain ID: 11155111)

For Stacks blockchain transactions, the app continues to use `@stacks/connect`.

## Utility Functions

The `src/utils/appkit.ts` file provides helper functions:
- `formatEVMAddress()`: Format EVM addresses for display
- `isValidEVMAddress()`: Validate EVM address format
- `getNetworkName()`: Get human-readable network name from chain ID

