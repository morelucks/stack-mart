import { truncateAddress } from '../utils/address';

interface AddressDisplayProps {
  address: string;
  showFull?: boolean;
}

export const AddressDisplay = ({ address, showFull = false }: AddressDisplayProps) => {
  return (
    <span className="font-mono text-sm">
      {showFull ? address : truncateAddress(address)}
    </span>
  );
};
