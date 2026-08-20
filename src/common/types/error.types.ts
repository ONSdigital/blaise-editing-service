export type ApiErrorCode = "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}
