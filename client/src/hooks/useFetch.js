import { useState, useEffect, useMemo } from 'react';

export default function useFetch(api, params, extra) {
  const [getData, setData] = useState([]);//for state that does not involve pagination
  const [pagedData, setpagedData] = useState([]); //state that involve pagination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const data = useMemo(() => getData, [getData]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // function to fectch the data
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api(params, extra, { signal });
        if (!signal.aborted) {
          setData(res.data);
          setpagedData(res.data?.pins);
          setError(null);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error?.response?.data?.error || error?.messsage);
        }
        console.error(error);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData()
    return () => {
        controller.abort()
    }
  }, [api, params,extra]);
  return {data, loading, error, setData, pagedData, setLoading};
}

//useMemo is used to memorize something, if you know that something is not going to change
