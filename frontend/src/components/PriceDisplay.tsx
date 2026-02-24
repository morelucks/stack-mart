import { formatSTX, formatBips } from '../utils/format';

interface PriceDisplayProps {
  microSTX: number;
  showLabel?: boolean;
}

export const PriceDisplay = ({ microSTX, showLabel = true }: PriceDisplayProps) => {
  return (
    <div className="flex items-baseline gap-1">
      {showLabel && <span className="text-sm text-gray-600">Price:</span>}
      <span className="text-lg font-bold">{formatSTX(microSTX)}</span>
      <span className="text-sm text-gray-500">STX</span>
    </div>
  );
};

interface RoyaltyDisplayProps {
  bips: number;
}

export const RoyaltyDisplay = ({ bips }: RoyaltyDisplayProps) => {
  return (
    <span className="text-sm text-gray-600">
      Royalty: {formatBips(bips)}%
    </span>
  );
};
