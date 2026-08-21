import { pinoHttp } from "pino-http";

import type { HttpLogger, Options as PinoHttpOptions } from "pino-http";

type PinoLevelLabel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
type CloudLogSeverity = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";

const pinoLevelToSeverityLookup: Record<PinoLevelLabel, CloudLogSeverity> = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL",
};

interface RawRequestWithUser {
  method?: string;
  url?: string;
  raw?: { user?: unknown };
}

function toCloudLogSeverity(levelLabel: string): CloudLogSeverity {
  switch (levelLabel) {
    case "trace":
      return pinoLevelToSeverityLookup.trace;
    case "debug":
      return pinoLevelToSeverityLookup.debug;
    case "info":
      return pinoLevelToSeverityLookup.info;
    case "warn":
      return pinoLevelToSeverityLookup.warn;
    case "error":
      return pinoLevelToSeverityLookup.error;
    case "fatal":
      return pinoLevelToSeverityLookup.fatal;
    default:
      return pinoLevelToSeverityLookup.info;
  }
}

function toRawRequestWithUser(value: unknown): RawRequestWithUser {
  if (!value || typeof value !== "object") {
    return {};
  }

  const methodValue = Reflect.get(value, "method");
  const urlValue = Reflect.get(value, "url");
  const rawValue = Reflect.get(value, "raw");
  const rawUserValue =
    rawValue && typeof rawValue === "object" ? Reflect.get(rawValue, "user") : undefined;

  return {
    method: typeof methodValue === "string" ? methodValue : undefined,
    url: typeof urlValue === "string" ? urlValue : undefined,
    raw: rawUserValue === undefined ? undefined : { user: rawUserValue },
  };
}

const defaultPinoConf: PinoHttpOptions = {
  messageKey: "message",
  formatters: {
    level(label, number) {
      return {
        severity: toCloudLogSeverity(label),
        level: number,
      };
    },
    log(info: Record<string, unknown>) {
      return { info };
    },
  },
  serializers: {
    req: (req: unknown) => {
      const parsedRequest = toRawRequestWithUser(req);

      return {
        method: parsedRequest.method,
        url: parsedRequest.url,
        user: parsedRequest.raw?.user,
      };
    },
  },
};

function withDefaultPinoOptions(options: PinoHttpOptions): PinoHttpOptions {
  return {
    ...options,
    ...defaultPinoConf,
  };
}

export default function createLogger(
  options: PinoHttpOptions = { autoLogging: false },
): HttpLogger {
  return pinoHttp(withDefaultPinoOptions(options));
}
