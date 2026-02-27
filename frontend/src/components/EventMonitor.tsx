import { useContractEvents, useFilteredEvents } from '../hooks/useContractEvents';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { TransactionLink } from './TransactionLink';

/**
 * Event monitor component displaying contract events
 * Uses @stacks/network through useContractEvents hook
 */
export const EventMonitor = () => {
  const { events, loading, error, refresh } = useContractEvents(50);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Contract Events</h2>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events found</p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-blue-600">
                  {event.event_type}
                </span>
                <span className="text-xs text-gray-500">
                  Index: {event.event_index}
                </span>
              </div>

              <TransactionLink txId={event.tx_id} />

              {event.contract_log && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Contract Log:</p>
                  <p className="text-gray-600">Topic: {event.contract_log.topic}</p>
                  <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                    {event.contract_log.value.repr}
                  </pre>
                </div>
              )}

              {event.stx_transfer_event && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">STX Transfer:</p>
                  <p className="text-gray-600">
                    From: {event.stx_transfer_event.sender.slice(0, 10)}...
                  </p>
                  <p className="text-gray-600">
                    To: {event.stx_transfer_event.recipient.slice(0, 10)}...
                  </p>
                  <p className="text-gray-600">
                    Amount: {parseInt(event.stx_transfer_event.amount) / 1_000_000} STX
                  </p>
                </div>
              )}

              {event.asset_event && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Asset Event:</p>
                  <p className="text-gray-600">Type: {event.asset_event.asset_event_type}</p>
                  <p className="text-gray-600">Asset: {event.asset_event.asset_id}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Filtered event monitor for specific event types
 */
export const FilteredEventMonitor = () => {
  const [filter, setFilter] = React.useState<'all' | 'print' | 'stx_transfer' | 'asset'>('all');
  const { events, loading, error, refresh } = useFilteredEvents(filter, 30);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Filtered Events</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Events</option>
            <option value="print">Print Events</option>
            <option value="stx_transfer">STX Transfers</option>
            <option value="asset">Asset Events</option>
          </select>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No {filter !== 'all' ? filter : ''} events found
          </p>
        ) : (
          events.map((event, index) => (
            <div key={index} className="border rounded p-3 bg-gray-50 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{event.event_type}</span>
                <TransactionLink txId={event.tx_id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Add React import
import React from 'react';
