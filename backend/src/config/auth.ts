import crypto from 'node:crypto';
import { betterAuth } from 'better-auth';
import pool from './database';
import { env } from './env';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email';

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

const buildBaseUrl = (): string => {
  try {
    const base = new URL(env.authBaseUrl);
    return `${base.origin}/auth`;
  } catch {
    return `${env.authBaseUrl}/auth`;
  }
};

export const auth = betterAuth({
  secret: env.betterAuthSecret,
  baseURL: buildBaseUrl(),
  database: {
    provider: 'pg',
    pool,
  },
  trustedOrigins: env.trustedOrigins,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      enabled: googleEnabled,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      enabled: githubEnabled,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: false,
      },
      countryCode: {
        type: 'string',
        required: false,
      },
    },
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: env.isProduction,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
