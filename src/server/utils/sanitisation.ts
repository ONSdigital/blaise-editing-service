export type SanitisedLogString = string & { readonly __sanitisedForLogging: unique symbol };

/**
 * Sanitises a value for safe logging by removing line breaks and control characters.
 * Removes CR/LF and Unicode line separators explicitly to prevent log line injection,
 * removes remaining C0 control characters (\x00-\x1F excluding CR/LF) and DEL (\x7F),
 * normalises repeated spaces, and trims the result.
 *
 * @param value The value to sanitise
 * @returns The sanitised string
 */
export function sanitiseForLogging(value: unknown): SanitisedLogString {
  const stringValue = value == null ? "" : String(value);

  return (
    stringValue
      .replace(/[\r\n\u2028\u2029]+/g, " ") // Remove line breaks explicitly to prevent log forging
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+/g, " ") // Remove remaining control chars and DEL
      .replace(/ +/g, " ") // Normalise repeated spaces
      .trim() as SanitisedLogString
  );
}
