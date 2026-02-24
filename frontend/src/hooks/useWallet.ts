import { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';

export const useWallet = () => {
  const { userSession } = useConnect();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.mainnet);
      setIsConnected(true);
    }
  }, [userSession]);

  return { address, isConnected, userSession };
};
