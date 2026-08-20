import { type Auth } from "blaise-login-react-server";

import { sanitiseForLogging } from "../utils/sanitisation.js";

import type { Request } from "express";

interface RequestUserContext {
  username: string;
  role: string;
}

const UNKNOWN_USERNAME = "Unknown User";
const UNKNOWN_ROLE = "Unknown Role";

function sanitiseOrFallback(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const sanitised = sanitiseForLogging(value);

  return sanitised === "" ? fallback : sanitised;
}

export default function getRequestUserContext(request: Request, auth: Auth): RequestUserContext {
  try {
    const token = auth.getToken(request);
    const user = auth.getUser(token);

    if (user) {
      return {
        username: sanitiseOrFallback(user.name, UNKNOWN_USERNAME),
        role: sanitiseOrFallback(user.role, UNKNOWN_ROLE),
      };
    }
  } catch {
    // Preserve handler-level error flow by falling back when auth context is unavailable.
  }

  return {
    username: UNKNOWN_USERNAME,
    role: UNKNOWN_ROLE,
  };
}
