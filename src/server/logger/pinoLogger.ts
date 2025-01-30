import logger, { HttpLogger, Options } from 'pino-http';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const defaultPinoConf = {
  messageKey: 'message',
  formatters: {
    level(label: unknown, number: unknown) {
      return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        severity: PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup.info,
        level: number,
      };
    },
    log(info: Record<string, unknown>) {
      return { info };
    },
  },
  serializers: {
    req(req: { method: unknown; url: unknown; raw: { user: unknown; } }) {
      return { method: req.method, url: req.url, user: req.raw.user };
    },
  },
  autoLogging: false,
};

export default function createLogger(options: Options = { autoLogging: false }): HttpLogger {
  const pinoConfig = defaultPinoConf;
  return logger({ ...options, ...pinoConfig });
}
