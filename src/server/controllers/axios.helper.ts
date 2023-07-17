import axios, { AxiosError, AxiosResponse } from 'axios';

export function errorNotFound(error: unknown | AxiosError): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 404;
  }
  return false;
}

export function createAxiosError(responceStatus: number) {
  const axiosResponse: AxiosResponse = {
    status: responceStatus,
  } as AxiosResponse;

  return {
    config: {},
    request: {},
    response: axiosResponse,
    isAxiosError: true,
  } as unknown as AxiosError<unknown>;
}
