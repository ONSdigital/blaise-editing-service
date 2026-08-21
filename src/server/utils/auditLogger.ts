import { type IncomingMessage } from "http";

import { sanitiseForLogging } from "./sanitisation.js";

export default class AuditLogger {
  constructor(_projectId: string, _moduleId = process.env.GAE_SERVICE ?? "bes-ui") {}

  info(logger: IncomingMessage["log"], message: string): void {
    logger.info(sanitiseForLogging(`AUDIT_LOG: ${message}`));
  }

  error(logger: IncomingMessage["log"], message: string): void {
    logger.error(sanitiseForLogging(`AUDIT_LOG: ${message}`));
  }
}
