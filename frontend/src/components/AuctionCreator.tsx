import React, { useState } from 'react';
import { useCreateAuction } from '../hooks/useCreateAuction';

export const AuctionCreator: React.FC = () => {
  const [nftContract, setNftContract] = useState('');
  const [nftId, setNftId] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [title, setTitle] = useState('');
  const { createAuction } = useCreateAuction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAuction(
      nftContract,
      parseInt(nftId),
      parseInt(reservePrice),
      parseInt(duration),
      title
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Create Auction</h2>
      <input placeholder="NFT Contract" value={nftContract} onChange={(e) => setNftContract(e.target.value)} required />
      <input placeholder="NFT ID" type="number" value={nftId} onChange={(e) => setNftId(e.target.value)} required />
      <input placeholder="Reserve Price (STX)" type="number" value={reservePrice} onChange={(e) => setReservePrice(e.target.value)} required />
      <input placeholder="Duration (blocks)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <button type="submit">Create Auction</button>
    </form>
  );
};
