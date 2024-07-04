import { getRetry } from '@/utils/helpers';
import { type Accessor, createEffect, createSignal } from 'solid-js';

/* The use query return type */
export interface UseQueryOptions<QueryData, Data> {
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
  /* The initial data for the hook */
  initialData?: Data | (() => Data);
  /* The placeholder data for the hook */
  placeholderData?: Data | (() => Data);
  /* The retry count of requests */
  retry?: boolean | number;
  /* The refetch interval */
  refetchInterval?: number;
}

/* The use query return type */
export interface UseQueryReturn<Data> {
  /* The state of the query */
  data: Accessor<Data | undefined>;
  /* The loading state of the query */
  isLoading: Accessor<boolean>;
  /* The error state of the query */
  isError: Accessor<boolean>;
  /* The success state of the query */
  isSuccess: Accessor<boolean>;
  /* The success state of the query */
  error: Accessor<Error | undefined>;
  /* The refetch function */
  refetch: () => void;
  /* The refetch async function */
  isRefetching: Accessor<boolean>;
}

/**
 * @name useQuery
 * @description - Hook that defines the logic when query data
 * @category Utilities
 *
 * @template Data The type of the data
 * @param {() => Promise<Data>} callback The callback function to be invoked
 * @param {DependencyList} [options.keys] The dependencies for the hook
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @param {UseQueryOptionsSelect<Data>} [options.select] The select function to be invoked
 * @param {Data | (() => Data)} [options.initialData] The initial data for the hook
 * @param {Data | (() => Data)} [options.placeholderData] The placeholder data for the hook
 * @param {number} [options.refetchInterval] The refetch interval
 * @param {boolean | number} [options.retry] The retry count of requests
 * @returns {UseQueryReturn<Data>} An object with the state of the query
 *
 * @example
 * const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useQuery(() => fetch('https://example.com/data'));
 */
export const useQuery = <QueryData, Data = QueryData>(
  callback: () => Promise<QueryData>,
  options?: UseQueryOptions<QueryData, Data>,
): UseQueryReturn<Data> => {
  let retryCount = options?.retry ? getRetry(options.retry) : 0;
  let refetchInterval: ReturnType<typeof setInterval>;
  const [isLoading, setIsLoading] = createSignal(false);
  const [isError, setIsError] = createSignal(false);
  const [isRefetching, setIsRefetching] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(!!options?.initialData);

  const [error, setError] = createSignal<Error | undefined>(undefined);
  const [data, setData] = createSignal<Data | undefined>(
    options?.initialData instanceof Function
      ? options?.initialData()
      : options?.initialData,
  );

  const request = (action: 'init' | 'refetch') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    refetchInterval && clearInterval(refetchInterval);
    if (action === 'refetch') setIsRefetching(true);
    else setIsLoading(true);

    // eslint-disable-next-line promise/catch-or-return
    callback()
      .then(response => {
        const data = (
          options?.select ? options?.select(response) : response
        ) as Data;
        options?.onSuccess?.(data);
        setData(() => data);
        setIsSuccess(true);
        setIsLoading(false);
        setError(undefined);
        setIsError(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .catch((error: Error) => {
        if (retryCount > 0) {
          retryCount -= 1;
          return request(action);
        }
        options?.onError?.(error);
        setData(undefined);
        setIsSuccess(false);
        setIsLoading(false);
        setError(error);
        setIsError(true);
        if (action === 'refetch') setIsRefetching(false);
        retryCount = options?.retry ? getRetry(options.retry) : 0;
      })
      .finally(() => {
        if (options?.refetchInterval) {
          refetchInterval = setInterval(() => {
            request('refetch');
            clearInterval(refetchInterval);
          }, options?.refetchInterval);
        }
      });
  };

  createEffect(() => {
    if (options?.initialData) return;
    request('init');
  });

  const refetch = () => request('refetch');

  const placeholderData =
    options?.placeholderData instanceof Function
      ? options?.placeholderData()
      : options?.placeholderData;

  return {
    data: data ?? (() => placeholderData),
    error,
    refetch,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
  };
};
