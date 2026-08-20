/**
 * Sanitises a string for safe logging by removing control characters.
 * Replaces newlines, carriage returns, and tabs with spaces, then trims the result.
 * This prevents log injection attacks.
 *
 * @param value The string to sanitise
 * @returns The sanitised string
 */
export function sanitiseForLogging(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}
