import { useCallback, useState } from 'react';

// Not currently used. Just experimenting with some react hook ideas and typing possibilities.

export type ParameterType<T extends (args: any) => any> = T extends (args: infer P) => any ? P : never;

export const apiFetchFactory = <K extends string>({name, url, options}: {
  name: K;
  url: string;
  options?: Parameters<typeof fetch>[1];
}) => {
  const apiFetch = async <D>(paramOptions?: Parameters<typeof fetch>[1]) => {
    const response = await fetch(url, {...options, ...paramOptions});
    const data = await response.json();

    return data as D;
  };

  const useApi = <D>() => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<D | null>(null);
  
    const fetchWrapper = useCallback(async (props?: ParameterType<typeof apiFetch>) => {
      setIsLoading(true);
      try {
        const newData = await apiFetch<D>(props);
        setData(newData);
        setIsLoading(false);
        return newData;
      } catch (e) {
        setError(e);
        setIsLoading(false);
        throw e;
      }
    }, []);
  
    return { isLoading, error, data, apiFetch: fetchWrapper };
  };

  return {
    [name]: apiFetch,
    [`use${name.replace(/^\w/, (c) => c.toUpperCase())}`]: useApi
  } as {[P in K]: typeof apiFetch} &
    {[P in `use${Capitalize<K>}`]: typeof useApi};
};

const apiFetch = async <D>(paramOptions?: Parameters<typeof fetch>[1]) => {
  const response = await fetch('', paramOptions);
  const data = await response.json();

  return data as D;
};

const useApi = <D>(fetchFunc: typeof apiFetch) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<D | null>(null);

  const fetchWrapper = useCallback(async (props?: ParameterType<typeof apiFetch>) => {
    setIsLoading(true);
    try {
      const newData = await fetchFunc<D>(props);
      setData(newData);
      setIsLoading(false);
      return newData;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  }, [fetchFunc]);

  return { isLoading, error, data, apiFetch: fetchWrapper };
};
