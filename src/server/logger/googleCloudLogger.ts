import { Logger } from 'winston';

export function formatLogMessage(text: string): string {
  const message = text.replace(/[^\x20-\x7E\r\n]+/g, '');
  const logFormat = 'AUDIT_LOG: message';
  return logFormat.replace('message', message);
}

export default class GoogleCloudLogger {
  baseLogger: Logger;

  constructor(baseLogger: Logger) {
    this.baseLogger = baseLogger;
    this.info = this.info.bind(this);
    this.error = this.error.bind(this);
  }

  info(message: string): void {
    const log = formatLogMessage(message);
    this.baseLogger.info(log);
  }

  error(message: string): void {
    const log = formatLogMessage(message);
    this.baseLogger.error(log);
  }
}
