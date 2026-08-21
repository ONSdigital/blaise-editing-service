import type { AxiosError, AxiosResponse } from "axios";

export default function createAxiosError(responseStatus: number) {
  const axiosResponse: AxiosResponse = {
    status: responseStatus,
  } as AxiosResponse;

  return {
    config: {},
    request: {},
    response: axiosResponse,
    isAxiosError: true,
  } as unknown as AxiosError<unknown>;
}
