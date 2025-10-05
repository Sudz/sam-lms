import dotenv from 'dotenv';

dotenv.config();

type EnvVar = string | undefined;

const getRequired = (key: string, value: EnvVar): string => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const sanitizeUrl = (url: EnvVar): string | undefined => {
  if (!url) {
    return undefined;
  }

  return url.replace(/\/$/, '');
};

const parseOrigins = (rawOrigins: EnvVar, fallback: string[]): string[] => {
  if (!rawOrigins || rawOrigins.trim().length === 0) {
    return fallback;
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
    .map((origin) => origin.replace(/\/$/, ''));
};

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

const frontendUrl = sanitizeUrl(process.env.FRONTEND_URL) ?? 'http://localhost:5173';
const siteUrl = sanitizeUrl(process.env.SITE_URL) ?? frontendUrl;
const authBaseUrl = sanitizeUrl(process.env.BETTERAUTH_BASE_URL) ?? siteUrl;

const defaultOrigins = [frontendUrl, siteUrl, authBaseUrl].filter(
  (origin, index, arr) => arr.indexOf(origin) === index
);

const trustedOrigins = parseOrigins(
  process.env.BETTERAUTH_TRUSTED_ORIGINS,
  defaultOrigins
);

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: getRequired('DATABASE_URL', process.env.DATABASE_URL),
  betterAuthSecret: getRequired('BETTERAUTH_SECRET', process.env.BETTERAUTH_SECRET),
  emailFrom: getRequired('BETTERAUTH_EMAIL_FROM', process.env.BETTERAUTH_EMAIL_FROM),
  resendApiKey: process.env.RESEND_API_KEY,
  frontendUrl,
  siteUrl,
  authBaseUrl,
  trustedOrigins,
};

export const ensureEnv = (): void => {
  const optionalWarnings: Array<[string, EnvVar]> = [
    ['GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID],
    ['GITHUB_CLIENT_ID', process.env.GITHUB_CLIENT_ID],
    ['RESEND_API_KEY', process.env.RESEND_API_KEY],
  ];

  optionalWarnings
    .filter(([, value]) => !value)
    .forEach(([key]) => {
      console.warn(`[env] Optional environment variable ${key} is not set.`);
    });
};

export type Env = typeof env;
