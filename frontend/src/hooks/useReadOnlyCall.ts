import { useState, useEffect, useCallback } from 'react';
import { 
  fetchCallReadOnlyFunction as callReadOnlyFunction,
  cvToJSON,
  ClarityValue,
  ClarityType
} from '@stacks/transactions';
import { getNetwork } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';

interface UseReadOnlyCallOptions {
  contractAddress?: string;
  contractName?: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress: string;
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Generic hook for read-only contract calls using @stacks/transactions
 */
export const useReadOnlyCall = <T = any>({
  contractAddress = CONTRACT_ADDRESS,
  contractName = CONTRACT_NAME,
  functionName,
  functionArgs,
  senderAddress,
  enabled = true,
  refetchInterval,
}: UseReadOnlyCallOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !senderAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await callReadOnlyFunction({
        network: getNetwork(),
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress,
      });

      // Convert Clarity value to JSON
      const jsonResult = cvToJSON(result);
      setData(jsonResult as T);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      console.error('Read-only call failed:', err);
    } finally {
      setLoading(false);
    }
  }, [
    contractAddress,
    contractName,
    functionName,
    JSON.stringify(functionArgs),
    senderAddress,
    enabled,
  ]);

  useEffect(() => {
    fetchData();

    if (refetchInterval && enabled) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Hook for multiple read-only calls using @stacks/transactions
 */
export const useMultipleReadOnlyCalls = <T = any>(
  calls: Array<Omit<UseReadOnlyCallOptions, 'enabled' | 'refetchInterval'>>,
  enabled = true
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const promises = calls.map(call =>
        callReadOnlyFunction({
          network: getNetwork(),
          contractAddress: call.contractAddress || CONTRACT_ADDRESS,
          contractName: call.contractName || CONTRACT_NAME,
          functionName: call.functionName,
          functionArgs: call.functionArgs,
          senderAddress: call.senderAddress,
        })
      );

      const results = await Promise.all(promises);
      const jsonResults = results.map(result => cvToJSON(result) as T);
      setData(jsonResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      console.error('Multiple read-only calls failed:', err);
    } finally {
      setLoading(false);
    }
  }, [calls, enabled]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
  };
};

/**
 * Hook to check if a Clarity value is of expected type
 */
export const useClarityValueType = (value: ClarityValue | null) => {
  const isUint = value?.type === ClarityType.UInt;
  const isInt = value?.type === ClarityType.Int;
  const isBool = value?.type === ClarityType.BoolTrue || value?.type === ClarityType.BoolFalse;
  const isPrincipal = value?.type === ClarityType.PrincipalStandard || value?.type === ClarityType.PrincipalContract;
  const isBuffer = value?.type === ClarityType.Buffer;
  const isString = value?.type === ClarityType.StringASCII || value?.type === ClarityType.StringUTF8;
  const isList = value?.type === ClarityType.List;
  const isTuple = value?.type === ClarityType.Tuple;
  const isOptional = value?.type === ClarityType.OptionalSome || value?.type === ClarityType.OptionalNone;
  const isResponse = value?.type === ClarityType.ResponseOk || value?.type === ClarityType.ResponseErr;

  return {
    isUint,
    isInt,
    isBool,
    isPrincipal,
    isBuffer,
    isString,
    isList,
    isTuple,
    isOptional,
    isResponse,
  };
};
