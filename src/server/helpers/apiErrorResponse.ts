import type { ApiErrorCode, ApiErrorResponse } from "../../common/types/error.types.js";

export type ApiErrorStatusCode = 400 | 404 | 500;

const API_ERROR_DETAILS: Record<ApiErrorStatusCode, { code: ApiErrorCode; message: string }> = {
  400: {
    code: "BAD_REQUEST",
    message: "Invalid request",
  },
  404: {
    code: "NOT_FOUND",
    message: "Resource not found",
  },
  500: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Unable to complete request, please try again in a few minutes",
  },
};

export function createApiErrorResponse(
  statusCode: ApiErrorStatusCode,
  message?: string,
): ApiErrorResponse {
  const { code, message: defaultMessage } = API_ERROR_DETAILS[statusCode];

  return {
    error: {
      code,
      message: message ?? defaultMessage,
    },
  };
}
