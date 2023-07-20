import axios, { AxiosError } from 'axios';

export default function errorNotFound(error: unknown | AxiosError): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 404;
  }
  return false;
}
