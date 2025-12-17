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

export function isLoading<T>(state: AsyncState<T>): state is Loading {
  return state.state === 'loading';
}

export function hasErrored<T>(state: AsyncState<T>): state is Errored {
  return state.state === 'errored';
}

function loading(): Loading {
  return { state: 'loading' };
}

function errored(error: string): Errored {
  return { state: 'errored', error };
}

function succeeded<T>(data: T): Succeeded<T> {
  return { state: 'succeeded', data };
}

export function useAsyncRequestWithParam<T1, T2>(request:(param: T2) => Promise<T1>, param: T2) {
  const [state, setState] = useState<AsyncState<T1>>(loading());

  useEffect(() => {
    let ignore = false;
    
    request(param)
      .then((response) => {
        if (!ignore) {
          setState(succeeded(response));
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState(errored(error.message));
        }
      });
  
    return () => {
      ignore = true;
    };
  }, [request, param]);

  return state;
}

export function useAsyncRequestWithTwoParams<T1, T2, T3>(request:(param1: T2, param2: T3) => Promise<T1>, param1: T2, param2: T3) {
  const [state, setState] = useState<AsyncState<T1>>(loading());

  useEffect(() => {
    let ignore = false;
    
    request(param1, param2)
      .then((response) => {
        if (!ignore) {
          setState(succeeded(response));
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState(errored(error.message));
        }
      });

    return () => {
      ignore = true;
    };
  }, [request, param1, param2]);

  return state;
}

export function useAsyncRequestWithThreeParams<T1, T2, T3, T4>(request:(param1: T2, param2: T3, param3: T4) => Promise<T1>, param1: T2, param2: T3, param3: T4) {
  const [state, setState] = useState<AsyncState<T1>>(loading());

  useEffect(() => {
    let ignore = false;

    request(param1, param2, param3)
      .then((response) => {
        if (!ignore) {
          setState(succeeded(response));
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState(errored(error.message));
        }
      });

    return () => {
      ignore = true;
    };
  }, [request, param1, param2, param3]);

  return state;
}

export function useAsyncRequestWithThreeParamsWithRefresh<T1, T2, T3, T4, T5>(request:(param1: T2, param2: T3, param3: T4, resetParam:T5) => Promise<T1>, param1: T2, param2: T3, param3: T4, refreshParam: T5) {
  const [state, setState] = useState<AsyncState<T1>>(loading());

  useEffect(() => {
    let ignore = false;

    request(param1, param2, param3, refreshParam)
      .then((response) => {
        if (!ignore) {
          setState(succeeded(response));
        }
      })
      .catch((error) => {
        if (!ignore) {
          setState(errored(error.message));
        }
      });

    return () => {
      ignore = true;
    };
  }, [request, param1, param2, param3, refreshParam]);

  return state;
}
