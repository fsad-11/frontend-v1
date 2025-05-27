import { useState, useCallback } from "react";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// Generic hook for handling API requests with loading/error states
export function useApi<T, P = void>(
  apiFunc: (params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  // Execute the API call
  const execute = useCallback(
    async (params: P) => {
      try {
        setState({ data: null, isLoading: true, error: null });
        const data = await apiFunc(params);
        setState({ data, isLoading: false, error: null });
        options.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, isLoading: false, error });
        options.onError?.(error);
        throw error;
      }
    },
    [apiFunc, options]
  );

  // Reset the state
  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
