import axios from "axios";
import axiosConfig from "./api/AxiosApi";

export type ClientLogLevel = "log" | "info" | "warn" | "error" | "debug";

export interface ClientLogPayload {
    level: ClientLogLevel;
    message: string;
    args?: string[];
    pathname?: string;
    href?: string;
    userAgent?: string;
    timestamp?: string;
    stack?: string;
}

function safeStringify(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    if (value instanceof Error) {
        return value.stack || value.message || "Error";
    }
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

export async function sendClientLog(level: ClientLogLevel, ...args: unknown[]): Promise<void> {
    const message = args.length > 0 ? safeStringify(args[0]) : "";
    const pathname = typeof window !== "undefined" ? window.location.pathname : undefined;
    const href = typeof window !== "undefined" ? window.location.href : undefined;
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
    const errorArg = args.find((a) => a instanceof Error);
    const stack = errorArg instanceof Error ? errorArg.stack : undefined;

    const payload: ClientLogPayload = {
        level,
        message,
        args: args.slice(1, 21).map(safeStringify),
        timestamp: new Date().toISOString(),
        ...(pathname !== undefined ? { pathname } : {}),
        ...(href !== undefined ? { href } : {}),
        ...(userAgent !== undefined ? { userAgent } : {}),
        ...(stack !== undefined ? { stack } : {}),
    };

    try {
        await axios.post("/api/client-log", payload, axiosConfig());
    } catch {
        // Intentionally swallow.
    }
}