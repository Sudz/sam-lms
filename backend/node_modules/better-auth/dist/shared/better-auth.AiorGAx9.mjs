import { c as createAuthMiddleware, s as sessionMiddleware } from './better-auth.D_jpufHc.mjs';
import 'better-call';
import './better-auth.CpZXDeOc.mjs';
import * as z from 'zod';
import './better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import './better-auth.DgGir396.mjs';
import '@better-auth/utils/binary';
import '@better-auth/core/db';
import './better-auth.BZghgUMh.mjs';
import '@better-auth/utils/random';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import 'jose';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import './better-auth.B4Qoxdgc.mjs';
import 'kysely';
import { g as generateId } from './better-auth.BUPPRXfK.mjs';

const orgMiddleware = createAuthMiddleware(async () => {
  return {};
});
const orgSessionMiddleware = createAuthMiddleware(
  {
    use: [sessionMiddleware]
  },
  async (ctx) => {
    const session = ctx.context.session;
    return {
      session
    };
  }
);

const role = z.string();
const invitationStatus = z.enum(["pending", "accepted", "rejected", "canceled"]).default("pending");
z.object({
  id: z.string().default(generateId),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullish().optional(),
  metadata: z.record(z.string(), z.unknown()).or(z.string().transform((v) => JSON.parse(v))).optional(),
  createdAt: z.date()
});
z.object({
  id: z.string().default(generateId),
  organizationId: z.string(),
  userId: z.coerce.string(),
  role,
  createdAt: z.date().default(() => /* @__PURE__ */ new Date())
});
z.object({
  id: z.string().default(generateId),
  organizationId: z.string(),
  email: z.string(),
  role,
  status: invitationStatus,
  teamId: z.string().nullish(),
  inviterId: z.string(),
  expiresAt: z.date()
});
const teamSchema = z.object({
  id: z.string().default(generateId),
  name: z.string().min(1),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional()
});
z.object({
  id: z.string().default(generateId),
  teamId: z.string(),
  userId: z.string(),
  createdAt: z.date().default(() => /* @__PURE__ */ new Date())
});
z.object({
  id: z.string().default(generateId),
  organizationId: z.string(),
  role: z.string(),
  permission: z.record(z.string(), z.array(z.string())),
  createdAt: z.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: z.date().optional()
});
const defaultRoles = ["admin", "member", "owner"];
z.union([
  z.enum(defaultRoles),
  z.array(z.enum(defaultRoles))
]);

export { orgSessionMiddleware as a, orgMiddleware as o, teamSchema as t };
