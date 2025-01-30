import { HttpLogger } from 'pino-http';

export function formatLogMessage(text: string): string {
  const message = text.replace(/[^\x20-\x7E\r\n]+/g, '');
  const logFormat = 'AUDIT_LOG: message';
  return logFormat.replace('message', message);
}

export default class GoogleCloudLogger {
  baseLogger: HttpLogger;

  projectId: string;

  logName: string;

  constructor(baseLogger: HttpLogger, projectId: string) {
    this.baseLogger = baseLogger;
    this.projectId = projectId;
    this.logName = `projects/${this.projectId}/logs/stdout`;
    this.info = this.info.bind(this);
    this.error = this.error.bind(this);
  }

  info(message: string): void {
    const log = formatLogMessage(message);
    this.baseLogger.logger.info(log);
  }

  error(message: string): void {
    const log = formatLogMessage(message);
    this.baseLogger.logger.error(log);
  }
}
