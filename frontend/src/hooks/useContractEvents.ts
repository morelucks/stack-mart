import { useState, useEffect, useCallback } from 'react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK, CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';

interface ContractEvent {
  event_index: number;
  event_type: string;
  tx_id: string;
  contract_log?: {
    contract_id: string;
    topic: string;
    value: {
      hex: string;
      repr: string;
    };
  };
  stx_transfer_event?: {
    sender: string;
    recipient: string;
    amount: string;
  };
  asset_event?: {
    asset_event_type: string;
    asset_id: string;
    sender?: string;
    recipient?: string;
    value?: string;
  };
}

interface ContractEventsResponse {
  limit: number;
  offset: number;
  events: ContractEvent[];
}

/**
 * Hook to fetch contract events using Stacks API
 * Monitors contract activity and events
 */
export const useContractEvents = (limit = 20) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
      const apiUrl = network.coreApiUrl;
      
      const contractId = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
      const url = `${apiUrl}/extended/v1/contract/${contractId}/events?limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data: ContractEventsResponse = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      console.error('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchEvents();
    
    // Refresh events every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
};

/**
 * Hook to filter events by type
 */
export const useFilteredEvents = (
  eventType: 'print' | 'stx_transfer' | 'asset' | 'all' = 'all',
  limit = 20
) => {
  const { events, loading, error, refresh } = useContractEvents(limit);

  const filteredEvents = events.filter(event => {
    if (eventType === 'all') return true;
    if (eventType === 'print') return event.event_type === 'smart_contract_log';
    if (eventType === 'stx_transfer') return event.event_type === 'stx_transfer_event';
    if (eventType === 'asset') return event.event_type.includes('asset');
    return false;
  });

  return {
    events: filteredEvents,
    loading,
    error,
    refresh,
  };
};

/**
 * Hook to get events for specific transaction
 */
export const useTransactionEvents = (txId: string | null) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txId) return;

    const fetchTxEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
        const apiUrl = network.coreApiUrl;
        
        const url = `${apiUrl}/extended/v1/tx/${txId}/events`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction events');
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Transaction events fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTxEvents();
  }, [txId]);

  return {
    events,
    loading,
    error,
  };
};

/**
 * Hook to monitor real-time contract events
 */
export const useRealtimeEvents = (onNewEvent?: (event: ContractEvent) => void) => {
  const [latestEvent, setLatestEvent] = useState<ContractEvent | null>(null);
  const { events, refresh } = useContractEvents(1);

  useEffect(() => {
    if (events.length > 0) {
      const newEvent = events[0];
      setLatestEvent(newEvent);
      onNewEvent?.(newEvent);
    }
  }, [events, onNewEvent]);

  useEffect(() => {
    // Poll for new events every 10 seconds
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    latestEvent,
    refresh,
  };
};
