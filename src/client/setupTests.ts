import "@testing-library/jest-dom";

validateRequiredImportMetaEnv();

function validateRequiredImportMetaEnv(): void {
  const env = import.meta.env as Record<string, string | undefined>;

  assertRequiredEnvValue(env, "VITE_PROJECT_ID", "PROJECT_ID");
  assertRequiredEnvValue(env, "VITE_URL_DOMAIN", "URL_DOMAIN");
}

function assertRequiredEnvValue(
  env: Record<string, string | undefined>,
  viteKey: "VITE_PROJECT_ID" | "VITE_URL_DOMAIN",
  fallbackKey: "PROJECT_ID" | "URL_DOMAIN",
): void {
  if (env[viteKey]?.trim()) {
    return;
  }

  throw new Error(
    `Missing ${viteKey} for client tests. Set ${viteKey} or ${fallbackKey} before running Vitest.`,
  );
}
