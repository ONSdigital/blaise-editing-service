import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { 
  useAsyncRequest, 
  useAsyncRequestWithParam, 
  useAsyncRequestWithTwoParams,
  useAsyncRequestWithThreeParams,
  useAsyncRequestWithThreeParamsWithRefresh,
  isLoading,
  hasErrored
} from '../../../../../src/client/Common/hooks/useAsyncRequest.js';
import * as Hooks from '../../../../../src/client/Common/hooks/useAsyncRequest.js';

describe('AsyncState Utilities', () => {
  it('isLoading correctly identifies loading state', () => {
    expect(isLoading({ state: 'loading' })).toBe(true);
    expect(isLoading({ state: 'succeeded', data: {} })).toBe(false);
  });

  it('hasErrored correctly identifies errored state', () => {
    expect(hasErrored({ state: 'errored', error: 'msg' })).toBe(true);
    expect(hasErrored({ state: 'loading' })).toBe(false);
  });
});

describe('useAsyncRequest Coverage Suite', () => {
  it('covers all branch logic for type guards', () => {
    const load = { state: 'loading' } as const;
    const err = { state: 'errored', error: 'fail' } as const;
    const succ = { state: 'succeeded', data: 'win' } as const;

    expect(isLoading(load)).toBe(true);
    expect(isLoading(err)).toBe(false);
    expect(hasErrored(err)).toBe(true);
    expect(hasErrored(succ)).toBe(false);
  });
 
  it('useAsyncRequest: covers success path', async () => {
    const mockReq = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncRequest(mockReq));
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
  });

  it('useAsyncRequestWithParam: covers success path', async () => {
    const mockReq = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncRequestWithParam(mockReq, 'p1'));
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
  });

  it('useAsyncRequestWithTwoParams: covers success path', async () => {
    const mockReq = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncRequestWithTwoParams(mockReq, 'p1', 'p2'));
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
  });

  it('useAsyncRequestWithThreeParams: covers success path', async () => {
    const mockReq = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncRequestWithThreeParams(mockReq, 'p1', 'p2', 'p3'));
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
  });

  it('useAsyncRequestWithThreeParamsWithRefresh: covers success path', async () => {
    const mockReq = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => 
      useAsyncRequestWithThreeParamsWithRefresh(mockReq, 'p1', 'p2', 'p3', 'ref')
    );
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
  });

  it('should NOT update state if unmounted before resolve (Branch Coverage)', async () => {
    let resolvePromise: (value: unknown) => void;
    const mockReq = vi.fn().mockImplementation(() => 
      new Promise((res) => { resolvePromise = res; })
    );
    const { result, unmount } = renderHook(() => useAsyncRequest(mockReq));
    unmount();
    resolvePromise!('data');
    expect(result.current.state).toBe('loading');
  });

  it('should NOT update state if unmounted before reject', async () => {
    let rejectPromise: (reason: Error) => void;
    const mockReq = vi.fn().mockImplementation(() => 
      new Promise((_, rej) => { rejectPromise = rej; })
    );
    const { result, unmount } = renderHook(() => useAsyncRequest(mockReq));
    unmount(); 
    rejectPromise!(new Error('silent error')); 
    expect(result.current.state).toBe('loading');
  });
});

describe('useAsyncRequest Hooks', () => {
  it('useAsyncRequest: should fetch data successfully', async () => {
    const mockData = { id: 123 };
    const mockRequest = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useAsyncRequest(mockRequest));
    expect(result.current.state).toBe('loading');
    await waitFor(() => {
      expect(result.current.state).toBe('succeeded');
    });
    if (result.current.state === 'succeeded') {
      expect(result.current.data).toEqual(mockData);
    }
  });

  it('useAsyncRequest: should handle errors', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Fetch failed'));
    const { result } = renderHook(() => useAsyncRequest(mockRequest));
    await waitFor(() => {
      expect(result.current.state).toBe('errored');
    });
    if (result.current.state === 'errored') {
      expect(result.current.error).toBe('Fetch failed');
    }
  });

  it('useAsyncRequestWithParam: should re-run when param changes', async () => {
    const mockRequest = vi.fn().mockImplementation((p: string) => Promise.resolve(`Result: ${p}`));
    const { result, rerender } = renderHook(
      ({ param }) => useAsyncRequestWithParam(mockRequest, param),
      { initialProps: { param: 'A' } }
    );
    await waitFor(() => expect(result.current.state).toBe('succeeded'));
    rerender({ param: 'B' });
    expect(result.current.state).toBe('succeeded');
    await waitFor(() => {
      if (result.current.state === 'succeeded') {
        expect(result.current.data).toBe('Result: B');
      }
    });
  });

  it('should ignore results if the component unmounts', async () => {
    let resolvePromise: (value: unknown) => void;
    const mockRequest = vi.fn().mockImplementation(() => 
      new Promise((resolve) => { resolvePromise = resolve; })
    );
    const { result, unmount } = renderHook(() => useAsyncRequest(mockRequest));
    unmount();
    resolvePromise!({ data: 'finished' });
    expect(result.current.state).toBe('loading');
  });

  it('useAsyncRequestWithTwoParams: should pass both params to the request', async () => {
    const mockRequest = vi.fn().mockResolvedValue('ok');
    renderHook(() => useAsyncRequestWithTwoParams(mockRequest, 'first', 2));
    expect(mockRequest).toHaveBeenCalledWith('first', 2);
  });

  it('useAsyncRequestWithThreeParams: should pass all params to the request', async () => {
    const mockRequest = vi.fn().mockResolvedValue('ok');
    renderHook(() => useAsyncRequestWithThreeParams(mockRequest, 'first', 2, 'third'));
    expect(mockRequest).toHaveBeenCalledWith('first', 2, 'third');
  });
});

describe('useAsyncRequest Hooks - Error Handling', () => {
  it('useAsyncRequest should catch and store error message', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Basic Error'));
    const { result } = renderHook(() => useAsyncRequest(mockRequest));
    await waitFor(() => expect(result.current.state).toBe('errored'));
    if (result.current.state === 'errored') {
      expect(result.current.error).toBe('Basic Error');
    }
  });

  it('useAsyncRequestWithParam should catch error with 1 param', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Param 1 Error'));
    const { result } = renderHook(() => useAsyncRequestWithParam(mockRequest, 'test'));
    await waitFor(() => expect(result.current.state).toBe('errored'));
    if (result.current.state === 'errored') {
      expect(result.current.error).toBe('Param 1 Error');
    }
    expect(mockRequest).toHaveBeenCalledWith('test');
  });

  it('useAsyncRequestWithTwoParams should catch error with 2 params', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Param 2 Error'));
    const { result } = renderHook(() => 
      useAsyncRequestWithTwoParams(mockRequest, 'p1', 'p2')
    );
    await waitFor(() => expect(result.current.state).toBe('errored'));
    if (result.current.state === 'errored') {
      expect(result.current.error).toBe('Param 2 Error');
    }
    expect(mockRequest).toHaveBeenCalledWith('p1', 'p2');
  });

  it('useAsyncRequestWithThreeParams should catch error with 3 params', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Param 3 Error'));
    const { result } = renderHook(() => 
      useAsyncRequestWithThreeParams(mockRequest, 'a', 'b', 'c')
    );
    await waitFor(() => expect(result.current.state).toBe('errored'));
    if (result.current.state === 'errored') {
      expect(result.current.error).toBe('Param 3 Error');
    }
    expect(mockRequest).toHaveBeenCalledWith('a', 'b', 'c');
  });

  it('useAsyncRequestWithThreeParamsWithRefresh should catch error and use refreshParam', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('Refresh Error'));
    const { result, rerender } = renderHook(
      ({ refresh }) => useAsyncRequestWithThreeParamsWithRefresh(
        mockRequest, 'a', 'b', 'c', refresh
      ),
      { initialProps: { refresh: 1 } }
    );
    await waitFor(() => expect(result.current.state).toBe('errored'));
    mockRequest.mockRejectedValueOnce(new Error('New Refresh Error'));
    rerender({ refresh: 2 });
    await waitFor(() => {
      if (result.current.state === 'errored') {
        expect(result.current.error).toBe('New Refresh Error');
      }
    });
    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(mockRequest).toHaveBeenLastCalledWith('a', 'b', 'c', 2);
  });

  it('covers the "ignore" branch (False branch of if !ignore)', async () => {
    let resolvePromise: (value: unknown) => void;
    const mockRequest = vi.fn().mockImplementation(() => 
      new Promise((resolve) => { resolvePromise = resolve; })
    );
    const { result, unmount } = renderHook(() => Hooks.useAsyncRequest(mockRequest));
    unmount();
    resolvePromise!({ data: 'some data' });
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.state).toBe('loading');
    });

  it('covers type guard false branches', () => {
    const successState = { state: 'succeeded', data: 'test' } as const;
    const loadingState = { state: 'loading' } as const;
    expect(isLoading(successState)).toBe(false); 
    expect(hasErrored(loadingState)).toBe(false);
  });
});