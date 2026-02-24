import { getExplorerUrl } from '../utils/address';

interface TransactionLinkProps {
  txId: string;
  network?: string;
}

export const TransactionLink = ({ txId, network = 'mainnet' }: TransactionLinkProps) => {
  return (
    <a
      href={getExplorerUrl(txId, network)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline font-mono text-sm"
    >
      {txId.slice(0, 8)}...{txId.slice(-8)}
    </a>
  );
};
