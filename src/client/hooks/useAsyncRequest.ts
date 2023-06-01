import { useEffect, useState } from 'react';

type Loading = {
  state: 'loading';
};
type Errored = {
  error: string;
  state: 'errored';
};
type Succeeded<T> = {
  data: T;
  state: 'succeeded';
};
export type AsyncState<T> = Loading | Errored | Succeeded<T>;

export function useAsyncRequest<T>(request: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    state: 'loading',
  });

  useEffect(() => {
    setState({ state: 'loading' });
    request()
      .then((response) => {
        setState({ data: response, state: 'succeeded' });
      })
      .catch((error) => setState({ error: error.message, state: 'errored' }));
  }, [request]);

  return state;
}
