export * from '@better-auth/core/db';
export { d as convertFromDB, b as convertToDB, c as createInternalAdapter, a as getAdapter, e as getMigrations, f as getSchema, g as getWithHooks, m as matchType } from '../shared/better-auth.DiiCErDI.mjs';
export { g as getAuthTables } from '../shared/better-auth.DhziC0ap.mjs';
export { t as toZodSchema } from '../shared/better-auth.BxexnJiR.mjs';
export { a as accountSchema, c as coreSchema, m as mergeSchema, h as parseAccountInput, b as parseAccountOutput, g as parseAdditionalUserInput, e as parseInputData, i as parseSessionInput, d as parseSessionOutput, f as parseUserInput, p as parseUserOutput, s as sessionSchema, u as userSchema, v as verificationSchema } from '../shared/better-auth.BZghgUMh.mjs';
import '../shared/better-auth.CW6D9eSx.mjs';
import '../shared/better-auth.BQOp-6ij.mjs';
import '../shared/better-auth.CiuwFiHM.mjs';
import 'zod';
import '../shared/better-auth.BTrSrKsi.mjs';
import '../shared/better-auth.DgGir396.mjs';
import '../shared/better-auth.BUPPRXfK.mjs';
import '@better-auth/utils/random';
import 'better-call';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import '@better-auth/utils/base64';
import 'jose';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import '../shared/better-auth.B4Qoxdgc.mjs';
import '../shared/better-auth.DdzSJf-n.mjs';
import '../shared/better-auth.BJYrr86k.mjs';
import 'kysely';
import '../shared/better-auth.BrEH5bcK.mjs';
import '../shared/better-auth.Ou1j2X6M.mjs';

const createFieldAttribute = (type, config) => {
  return {
    type,
    ...config
  };
};

export { createFieldAttribute };
