import { type IncomingMessage } from "http";

import { type SanitisedLogString, sanitiseForLogging } from "./sanitisation.js";

export default class AuditLogger {
  constructor(_projectId: string, _moduleId = process.env.GAE_SERVICE ?? "bes-ui") {}

  info(logger: IncomingMessage["log"], message: SanitisedLogString): void {
    const auditLogMessage = sanitiseForLogging(message);

    logger.info({ auditLogMessage }, "AUDIT_LOG");
  }

  error(logger: IncomingMessage["log"], message: SanitisedLogString): void {
    const auditLogMessage = sanitiseForLogging(message);

    logger.error({ auditLogMessage }, "AUDIT_LOG");
  }
}
