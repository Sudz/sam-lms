import { createAuthClient } from "better-auth/react";

type EnvSource = Record<string, string | undefined> | undefined;

const getRuntimeEnv = (): EnvSource => {
  if (typeof globalThis === "undefined") {
    return undefined;
  }

  const maybeProcess = (globalThis as Record<string, unknown>).process as { env?: Record<string, string | undefined> } | undefined;
  return maybeProcess?.env;
};

const getEnvValue = (keys: string[]): string | undefined => {
  const runtimeEnv = getRuntimeEnv();
  const buildEnv: EnvSource = (typeof import.meta !== "undefined" ? import.meta.env : undefined) as EnvSource;

  for (const key of keys) {
    const value = buildEnv?.[key] ?? runtimeEnv?.[key];
    if (value) {
      return value;
    }
  }

  return undefined;
};

const rawBaseUrl = getEnvValue([
  "VITE_BETTERAUTH_URL",
  "NEXT_PUBLIC_BETTERAUTH_URL",
  "VITE_API_URL",
  "NEXT_PUBLIC_API_URL",
]);

if (!rawBaseUrl) {
  throw new Error(
    "Missing BetterAuth base URL. Set VITE_BETTERAUTH_URL (or NEXT_PUBLIC_BETTERAUTH_URL) in your environment."
  );
}

const baseURL = rawBaseUrl.replace(/\/$/, "");

const rawApiBase = getEnvValue([
  "VITE_API_URL",
  "NEXT_PUBLIC_API_URL",
]);

const inferApiBase = (): string => {
  if (baseURL.endsWith('/auth')) {
    return baseURL.replace(/\/auth$/, '/api');
  }
  return baseURL;
};

const apiBaseURL = (rawApiBase ?? inferApiBase()).replace(/\/$/, '');

export const authClient = createAuthClient({
  baseURL,
});

export const AUTH_BASE_URL = baseURL;
export const API_BASE_URL = apiBaseURL;