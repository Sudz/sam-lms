import '../shared/better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import '../shared/better-auth.DgGir396.mjs';
import '@better-auth/utils/binary';
import { p as parseSetCookieHeader } from '../shared/better-auth.L4mY8Wf-.mjs';
import 'better-call';
import 'zod';
import { c as createAuthMiddleware } from '../shared/better-auth.D_jpufHc.mjs';
import '../shared/better-auth.CpZXDeOc.mjs';
import '@better-auth/core/db';
import '../shared/better-auth.BZghgUMh.mjs';
import '@better-auth/utils/random';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import 'jose';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import '../shared/better-auth.B4Qoxdgc.mjs';
import 'kysely';
import '../shared/better-auth.AiorGAx9.mjs';
import '../plugins/organization/access/index.mjs';
import '@better-auth/utils/otp';
import '../plugins/admin/access/index.mjs';
import '@better-fetch/fetch';
import '@better-auth/utils';
import '../plugins/custom-session/index.mjs';
import '@noble/hashes/sha3.js';
import '../plugins/device-authorization/index.mjs';
import '../shared/better-auth.DdzSJf-n.mjs';
import '../shared/better-auth.CW6D9eSx.mjs';
import '../shared/better-auth.BTrSrKsi.mjs';
import '../shared/better-auth.BAQSo96z.mjs';
import '../shared/better-auth.D2xndZ2p.mjs';
import '../crypto/index.mjs';
import 'jose/errors';
import '../shared/better-auth.BUPPRXfK.mjs';
import 'defu';
import '../plugins/access/index.mjs';
import '../shared/better-auth.DQI8AD7d.mjs';
import '../shared/better-auth.BpA03GIs.mjs';

function toNextJsHandler(auth) {
  const handler = async (request) => {
    return "handler" in auth ? auth.handler(request) : auth(request);
  };
  return {
    GET: handler,
    POST: handler
  };
}
const nextCookies = () => {
  return {
    id: "next-cookies",
    hooks: {
      after: [
        {
          matcher(ctx) {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookies = returned?.get("set-cookie");
              if (!setCookies) return;
              const parsed = parseSetCookieHeader(setCookies);
              const { cookies } = await import('next/headers');
              let cookieHelper;
              try {
                cookieHelper = await cookies();
              } catch (error) {
                if (error instanceof Error && error.message.startsWith(
                  "`cookies` was called outside a request scope."
                )) {
                  return;
                }
                throw error;
              }
              parsed.forEach((value, key) => {
                if (!key) return;
                const opts = {
                  sameSite: value.samesite,
                  secure: value.secure,
                  maxAge: value["max-age"],
                  httpOnly: value.httponly,
                  domain: value.domain,
                  path: value.path
                };
                try {
                  cookieHelper.set(key, decodeURIComponent(value.value), opts);
                } catch (e) {
                }
              });
              return;
            }
          })
        }
      ]
    }
  };
};

export { nextCookies, toNextJsHandler };
