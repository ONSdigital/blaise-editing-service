import axios, { type AxiosError } from "axios";

export default function isNotFoundError(error: unknown | AxiosError): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 404;
  }

  return false;
}
