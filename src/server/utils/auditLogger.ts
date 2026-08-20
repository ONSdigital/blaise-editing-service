import { type IncomingMessage } from "http";

export default class AuditLogger {
  constructor(_projectId: string, _moduleId = process.env.GAE_SERVICE ?? "bes-ui") {}

  info(logger: IncomingMessage["log"], message: string): void {
    logger.info(`AUDIT_LOG: ${message}`);
  }

  error(logger: IncomingMessage["log"], message: string): void {
    logger.error(`AUDIT_LOG: ${message}`);
  }
}
