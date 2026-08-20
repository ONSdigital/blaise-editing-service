import { type Auth } from "blaise-login-react-server";
import express, { type Router } from "express";

import { createApiErrorResponse } from "../helpers/apiErrorResponse.js";

import type { Request, Response } from "express";

type ClientLogLevel = "log" | "info" | "warn" | "error" | "debug";
type ServerLogLevel = Exclude<ClientLogLevel, "log">;

type LogMethod = (payload: unknown, message: string) => void;

type RequestWithLog = Request & {
  log: Record<ServerLogLevel, LogMethod>;
};

interface ClientLogPayload {
  level: ClientLogLevel;
  message: string;
  args?: string[];
  pathname?: string;
  href?: string;
  userAgent?: string;
  timestamp?: string;
  stack?: string;
}

function normaliseLevel(level: string): Exclude<ClientLogLevel, "log"> | "info" | null {
  switch (level) {
    case "log":
    case "info":
      return "info";
    case "warn":
      return "warn";
    case "error":
      return "error";
    case "debug":
      return "debug";
    default:
      return null;
  }
}

function clamp(value: string, maxLen: number): string {
  if (value.length <= maxLen) {
    return value;
  }

  return value.slice(0, maxLen);
}

export default function clientLogHandler(auth: Auth): Router {
  const router = express.Router();

  router.post("/api/client-log", auth.middleware, (req: Request, res: Response) => {
    const body: Partial<ClientLogPayload> = req.body || {};

    if (typeof body.level !== "string") {
      return res.status(400).json(createApiErrorResponse(400, "Missing level"));
    }

    const level = normaliseLevel(body.level);

    if (!level) {
      return res.status(400).json(createApiErrorResponse(400, "Invalid level"));
    }

    if (typeof body.message !== "string" || body.message.trim() === "") {
      return res.status(400).json(createApiErrorResponse(400, "Missing message"));
    }

    const args = Array.isArray(body.args)
      ? body.args.slice(0, 20).map((a) => clamp(String(a), 1000))
      : undefined;
    const pathname = typeof body.pathname === "string" ? clamp(body.pathname, 500) : undefined;
    const href = typeof body.href === "string" ? clamp(body.href, 1000) : undefined;
    const userAgent =
      typeof body.userAgent === "string" ? clamp(body.userAgent, 500) : req.header("user-agent");
    const timestamp = typeof body.timestamp === "string" ? clamp(body.timestamp, 100) : undefined;
    const stack = typeof body.stack === "string" ? clamp(body.stack, 8000) : undefined;

    const clientLog: ClientLogPayload = {
      level: body.level as ClientLogLevel,
      message: clamp(body.message, 2000),
      ...(args !== undefined ? { args } : {}),
      ...(pathname !== undefined ? { pathname } : {}),
      ...(href !== undefined ? { href } : {}),
      ...(userAgent !== undefined ? { userAgent } : {}),
      ...(timestamp !== undefined ? { timestamp } : {}),
      ...(stack !== undefined ? { stack } : {}),
    };

    (req as RequestWithLog).log[level]({ clientLog }, `CLIENT_LOG: ${clientLog.message}`);

    return res.status(204).send();
  });

  return router;
}
