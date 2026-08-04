import { AxiosError, AxiosResponse } from 'axios';

export default function createAxiosError(responceStatus: number) {
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
