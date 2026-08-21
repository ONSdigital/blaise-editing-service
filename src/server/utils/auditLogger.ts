import { type IncomingMessage } from "http";

import { type SanitisedLogString, sanitiseForLogging } from "./sanitisation.js";

export default class AuditLogger {
  constructor(_projectId: string, _moduleId = process.env.GAE_SERVICE ?? "bes-ui") {}

  info(logger: IncomingMessage["log"], message: SanitisedLogString): void {
    logger.info(sanitiseForLogging(message));
  }

  error(logger: IncomingMessage["log"], message: SanitisedLogString): void {
    logger.error(sanitiseForLogging(message));
  }
}
