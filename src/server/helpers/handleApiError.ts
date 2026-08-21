import { type IncomingMessage } from "http";

import isNotFoundError from "../../common/helpers/axiosHelper.js";
import { sanitiseForLogging } from "../utils/sanitisation.js";
import { CsvValidationError } from "../utils/validation.js";

import { type ApiErrorStatusCode, createApiErrorResponse } from "./apiErrorResponse.js";

import type AuditLogger from "../utils/auditLogger.js";
import type { Response } from "express";

function getErrorStatusCode(error: unknown): ApiErrorStatusCode {
  if (error instanceof CsvValidationError) {
    return 400;
  }

  if (isNotFoundError(error)) {
    return 404;
  }

  return 500;
}

export default function handleApiError(
  error: unknown,
  response: Response,
  auditLogger: AuditLogger,
  requestLog: IncomingMessage["log"],
  failureMessage: string,
) {
  const statusCode = getErrorStatusCode(error);
  const sanitisedFailureMessage = sanitiseForLogging(failureMessage);
  const sanitisedError = sanitiseForLogging(String(error));
  const auditLogMessage = sanitiseForLogging(
    `${sanitisedFailureMessage} with ${statusCode} ${sanitisedError}`,
  );

  auditLogger.error(requestLog, auditLogMessage);

  return response.status(statusCode).json(createApiErrorResponse(statusCode));
}
