import { useEffect, useRef, useState } from "react";

type Loading = {
  state: "loading";
};

type Errored = {
  error: string;
  state: "errored";
};

type Succeeded<T> = {
  data: T;
  state: "succeeded";
};

export type AsyncState<T> = Loading | Errored | Succeeded<T>;

export function isLoading<T>(state: AsyncState<T>): state is Loading {
  return state.state === "loading";
}

export function hasErrored<T>(state: AsyncState<T>): state is Errored {
  return state.state === "errored";
}

function loading(): Loading {
  return { state: "loading" };
}

function errored(error: string): Errored {
  return { state: "errored", error };
}

function succeeded<T>(data: T): Succeeded<T> {
  return { state: "succeeded", data };
}

type AsyncRequest<TResponse, TParams extends readonly unknown[]> = (
  ...params: TParams
) => Promise<TResponse>;

function areParamsEqual<TParams extends readonly unknown[]>(
  previousParams: TParams | null,
  currentParams: TParams,
): boolean {
  if (previousParams === null || previousParams.length !== currentParams.length) {
    return false;
  }

  for (let index = 0; index < currentParams.length; index += 1) {
    if (!Object.is(previousParams[index], currentParams[index])) {
      return false;
    }
  }

  return true;
}

export function useAsyncRequest<TResponse, TParams extends readonly unknown[] = []>(
  request: AsyncRequest<TResponse, TParams>,
  ...params: TParams
) {
  const [state, setState] = useState<AsyncState<TResponse>>(() => loading());
  const previousRequestRef = useRef<AsyncRequest<TResponse, TParams> | null>(null);
  const previousParamsRef = useRef<TParams | null>(null);
  const requestSequenceRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const requestChanged = previousRequestRef.current !== request;
    const paramsChanged = !areParamsEqual(previousParamsRef.current, params);

    if (!requestChanged && !paramsChanged) {
      return;
    }

    previousRequestRef.current = request;
    previousParamsRef.current = params;
    const requestSequence = ++requestSequenceRef.current;

    request(...params)
      .then((response) => {
        if (isMountedRef.current && requestSequenceRef.current === requestSequence) {
          setState(succeeded(response));
        }
      })
      .catch((error: unknown) => {
        if (isMountedRef.current && requestSequenceRef.current === requestSequence) {
          setState(errored(error instanceof Error ? error.message : String(error)));
        }
      });
  }, [request, params]);

  return state;
}
