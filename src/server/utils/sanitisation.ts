/**
 * Sanitises a string for safe logging by removing control characters.
 * Removes all C0 control characters (\x00-\x1F) and DEL (\x7F), normalises
 * repeated whitespace, and trims the result. This prevents log injection attacks
 * including line forging, record manipulation, and terminal control sequences.
 *
 * @param value The string to sanitise
 * @returns The sanitised string
 */
export function sanitiseForLogging(value: string): string {
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F]+/g, " ") // Remove all C0 control chars and DEL
      .replace(/\s+/g, " ") // Normalise repeated whitespace
      .trim()
  );
}
