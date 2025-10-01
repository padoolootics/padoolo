import axios, { AxiosError, CancelTokenSource, CancelToken } from 'axios';
import { useEffect, useState } from 'react';

// Type definition for the async function that will be passed to the hook.
// `T` is the expected return type of the async function.
type AsyncFunction<T> = (cancelToken: CancelToken) => Promise<T>;

// Type definition for the hook's return object.
interface UseAsyncReturn<T> {
  data: T;
  error: string;
  loading: boolean;
}

const useAsync = <T>(asyncFunction: AsyncFunction<T>): UseAsyncReturn<T> => {
  // State variables
  const [data, setData] = useState<T | null>(null); // Start with null as a default value
  const [error, setError] = useState<string>('');
  const [errCode, setErrCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unmounted = false;
    const source: CancelTokenSource = axios.CancelToken.source(); // Axios cancel token

    (async () => {
      try {
        const res = await asyncFunction(source.token); // Use the cancel token here
        if (!unmounted) {
          setData(res); // Set the response data
          setError(''); // Clear any previous errors
          setLoading(false); // Set loading to false once data is fetched
        }
      } catch (err) {
        const axiosErr = err as AxiosError;
        setErrCode(axiosErr?.response?.status?.toString() || ''); // Extract error code if available

        if (!unmounted) {
          console.log(axiosErr.message); // Log error message
          setError(axiosErr.message); // Set error message

          // Check if the request was cancelled
          if (axios.isCancel(axiosErr)) {
            setError('Request canceled');
            setLoading(false);
            setData(null); // Reset data if request was canceled
          } else {
            setLoading(false);
            setData(null); // Reset data on error
          }
        }
      }
    })();

    // Cleanup function that runs when the component unmounts
    return () => {
      unmounted = true;
      source.cancel('Cancelled in cleanup'); // Cancel the request if the component unmounts
    };
  }, [asyncFunction]); // Effect will run once on mount and will clean up on unmount

  // Handle redirection on 401 error (Unauthorized)
  useEffect(() => {
    if (errCode === '401') {
      console.log('status 401', errCode);
      window.location.replace(`${process.env.NEXT_PUBLIC_STORE_DOMAIN}`);
    }
  }, [errCode]);

  return {
    data: data || ({} as T), // Return empty object if data is null
    error,
    loading,
  };
};

export default useAsync;
