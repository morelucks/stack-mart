import { showConnect } from '@stacks/connect';
import { userSession } from '../utils/auth';

export const ConnectWalletButton = () => {
  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: 'StackMart',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut('/');
  };

  const isConnected = userSession.isUserSignedIn();

  return (
    <button
      onClick={isConnected ? handleDisconnect : handleConnect}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      {isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
};
