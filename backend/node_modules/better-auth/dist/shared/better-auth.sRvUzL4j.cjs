'use strict';

const session = require('./better-auth.B0k5C6Ik.cjs');
require('better-call');
require('./better-auth.l_Ru3SGW.cjs');
const z = require('zod');
require('./better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('./better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
require('@better-auth/core/db');
require('./better-auth.Bu93hUoT.cjs');
require('@better-auth/utils/random');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('./better-auth.CYeOI8C-.cjs');
require('kysely');
const id = require('./better-auth.Bg6iw3ig.cjs');

function _interopNamespaceCompat(e) {
	if (e && typeof e === 'object' && 'default' in e) return e;
	const n = Object.create(null);
	if (e) {
		for (const k in e) {
			n[k] = e[k];
		}
	}
	n.default = e;
	return n;
}

const z__namespace = /*#__PURE__*/_interopNamespaceCompat(z);

const orgMiddleware = session.createAuthMiddleware(async () => {
  return {};
});
const orgSessionMiddleware = session.createAuthMiddleware(
  {
    use: [session.sessionMiddleware]
  },
  async (ctx) => {
    const session = ctx.context.session;
    return {
      session
    };
  }
);

const role = z__namespace.string();
const invitationStatus = z__namespace.enum(["pending", "accepted", "rejected", "canceled"]).default("pending");
z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  name: z__namespace.string(),
  slug: z__namespace.string(),
  logo: z__namespace.string().nullish().optional(),
  metadata: z__namespace.record(z__namespace.string(), z__namespace.unknown()).or(z__namespace.string().transform((v) => JSON.parse(v))).optional(),
  createdAt: z__namespace.date()
});
z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  organizationId: z__namespace.string(),
  userId: z__namespace.coerce.string(),
  role,
  createdAt: z__namespace.date().default(() => /* @__PURE__ */ new Date())
});
z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  organizationId: z__namespace.string(),
  email: z__namespace.string(),
  role,
  status: invitationStatus,
  teamId: z__namespace.string().nullish(),
  inviterId: z__namespace.string(),
  expiresAt: z__namespace.date()
});
const teamSchema = z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  name: z__namespace.string().min(1),
  organizationId: z__namespace.string(),
  createdAt: z__namespace.date(),
  updatedAt: z__namespace.date().optional()
});
z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  teamId: z__namespace.string(),
  userId: z__namespace.string(),
  createdAt: z__namespace.date().default(() => /* @__PURE__ */ new Date())
});
z__namespace.object({
  id: z__namespace.string().default(id.generateId),
  organizationId: z__namespace.string(),
  role: z__namespace.string(),
  permission: z__namespace.record(z__namespace.string(), z__namespace.array(z__namespace.string())),
  createdAt: z__namespace.date().default(() => /* @__PURE__ */ new Date()),
  updatedAt: z__namespace.date().optional()
});
const defaultRoles = ["admin", "member", "owner"];
z__namespace.union([
  z__namespace.enum(defaultRoles),
  z__namespace.array(z__namespace.enum(defaultRoles))
]);

exports.orgMiddleware = orgMiddleware;
exports.orgSessionMiddleware = orgSessionMiddleware;
exports.teamSchema = teamSchema;
