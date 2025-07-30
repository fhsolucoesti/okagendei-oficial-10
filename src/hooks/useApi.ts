import { useState, useCallback } from 'react';

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export const useApi = <T = any>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async <R = T>(
    apiCall: () => Promise<R>,
    options?: {
      onSuccess?: (data: R) => void;
      onError?: (error: string) => void;
      showLoading?: boolean;
    }
  ) => {
    const { onSuccess, onError, showLoading = true } = options || {};

    try {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const result = await apiCall();
      
      setState(prev => ({ 
        ...prev, 
        data: result as unknown as T, 
        loading: false, 
        error: null 
      }));
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      onError?.(errorMessage);
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setLoading,
    setError
  };
};