import axios, { AxiosRequestConfig } from 'axios';
import { AuthManager } from 'blaise-login-react-client';
import notFound from '../../server/helpers/axiosHelper';

function axiosConfig(): AxiosRequestConfig {
  const authManager = new AuthManager();
  return {
    headers: {
      'Content-Type': 'application/json',
      ...authManager.authHeader(),
    },
  };
}

export async function getDataFromNode<T>(url: string, notFoundError: string): Promise<T> {
  try {
    const response = await axios.get(url, axiosConfig());

    return response.data;
  } catch (error) {
    if (notFound(error)) {
      throw new Error(notFoundError);
    }
    throw new Error('Unable to complete request, please try again in a few minutes');
  }
}

export async function patchDataToNode(url: string, payload: any, notFoundError: string): Promise<void> {
  try {
    await axios.patch(url, payload, axiosConfig());
  } catch (error) {
    if (notFound(error)) {
      throw new Error(notFoundError);
    }
    throw new Error('Unable to complete request, please try again in a few minutes');
  }
}
