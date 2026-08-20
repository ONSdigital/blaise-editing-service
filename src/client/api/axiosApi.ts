import axios from "axios";
import { AuthManager } from "blaise-login-react-client";

import isNotFoundError from "../../common/helpers/axiosHelper";
import { getSharedAuthOptions } from "../utils/auth";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

export default function axiosConfig(): AxiosRequestConfig {
  const authOptions = getSharedAuthOptions();
  const authManager = new AuthManager(authOptions);

  return {
    headers: {
      "Content-Type": "application/json",
      ...authManager.authHeader(),
    },
  };
}

export async function getDataFromNode<T>(url: string, notFoundError: string): Promise<T> {
  try {
    const response = await axios.get(url, axiosConfig());

    return response.data;
  } catch (error) {
    if (isNotFoundError(error)) {
      throw new Error(notFoundError, { cause: error });
    }

    throw new Error("Unable to complete request, please try again in a few minutes", {
      cause: error,
    });
  }
}

export async function patchDataToNode(
  url: string,
  payload: unknown,
  notFoundError: string,
): Promise<number> {
  try {
    const response: AxiosResponse = await axios.patch(url, payload, axiosConfig());

    return response.status;
  } catch (error) {
    if (isNotFoundError(error)) {
      throw new Error(notFoundError, { cause: error });
    }

    throw new Error("Unable to complete request, please try again in a few minutes", {
      cause: error,
    });
  }
}
