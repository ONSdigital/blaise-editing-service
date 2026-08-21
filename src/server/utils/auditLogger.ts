import { type IncomingMessage } from "http";

import { sanitiseForLogging } from "./sanitisation.js";

export default class AuditLogger {
  constructor(_projectId: string, _moduleId = process.env.GAE_SERVICE ?? "bes-ui") {}

  info(logger: IncomingMessage["log"], message: string): void {
    const sanitisedMessage = sanitiseForLogging(message);
    const auditLogMessage = `AUDIT_LOG: ${sanitisedMessage}`;

    logger.info(auditLogMessage);
  }

  error(logger: IncomingMessage["log"], message: string): void {
    const sanitisedMessage = sanitiseForLogging(message);
    const auditLogMessage = `AUDIT_LOG: ${sanitisedMessage}`;

    logger.error(auditLogMessage);
  }
}
