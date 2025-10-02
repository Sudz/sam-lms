import { serializeSignedCookie } from 'better-call';
import '../../shared/better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import { createHMAC } from '@better-auth/utils/hmac';
import '../../shared/better-auth.DgGir396.mjs';
import '@better-auth/utils/binary';
import { p as parseSetCookieHeader } from '../../shared/better-auth.L4mY8Wf-.mjs';
import '../../shared/better-auth.CpZXDeOc.mjs';
import { c as createAuthMiddleware } from '../../shared/better-auth.D_jpufHc.mjs';
import 'zod';
import '@better-auth/core/db';
import '../../shared/better-auth.BZghgUMh.mjs';
import '@better-auth/utils/random';
import '@better-auth/utils/hash';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import 'jose';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import 'kysely';
import '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.CW6D9eSx.mjs';
import '../../shared/better-auth.BTrSrKsi.mjs';
import '../../shared/better-auth.BAQSo96z.mjs';
import '../../crypto/index.mjs';
import '@better-fetch/fetch';
import 'jose/errors';
import '../../shared/better-auth.BUPPRXfK.mjs';
import 'defu';
import '../../shared/better-auth.D2xndZ2p.mjs';

const bearer = (options) => {
  return {
    id: "bearer",
    hooks: {
      before: [
        {
          matcher(context) {
            return Boolean(
              context.request?.headers.get("authorization") || context.headers?.get("authorization")
            );
          },
          handler: createAuthMiddleware(async (c) => {
            const token = c.request?.headers.get("authorization")?.replace("Bearer ", "") || c.headers?.get("Authorization")?.replace("Bearer ", "");
            if (!token) {
              return;
            }
            let signedToken = "";
            if (token.includes(".")) {
              signedToken = token.replace("=", "");
            } else {
              if (options?.requireSignature) {
                return;
              }
              signedToken = (await serializeSignedCookie("", token, c.context.secret)).replace("=", "");
            }
            try {
              const decodedToken = decodeURIComponent(signedToken);
              const isValid = await createHMAC(
                "SHA-256",
                "base64urlnopad"
              ).verify(
                c.context.secret,
                decodedToken.split(".")[0],
                decodedToken.split(".")[1]
              );
              if (!isValid) {
                return;
              }
            } catch (e) {
              return;
            }
            const existingHeaders = c.request?.headers || c.headers;
            const headers = new Headers({
              ...Object.fromEntries(existingHeaders?.entries())
            });
            headers.append(
              "cookie",
              `${c.context.authCookies.sessionToken.name}=${signedToken}`
            );
            return {
              context: {
                headers
              }
            };
          })
        }
      ],
      after: [
        {
          matcher(context) {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const setCookie = ctx.context.responseHeaders?.get("set-cookie");
            if (!setCookie) {
              return;
            }
            const parsedCookies = parseSetCookieHeader(setCookie);
            const cookieName = ctx.context.authCookies.sessionToken.name;
            const sessionCookie = parsedCookies.get(cookieName);
            if (!sessionCookie || !sessionCookie.value || sessionCookie["max-age"] === 0) {
              return;
            }
            const token = sessionCookie.value;
            const exposedHeaders = ctx.context.responseHeaders?.get(
              "access-control-expose-headers"
            ) || "";
            const headersSet = new Set(
              exposedHeaders.split(",").map((header) => header.trim()).filter(Boolean)
            );
            headersSet.add("set-auth-token");
            ctx.setHeader("set-auth-token", token);
            ctx.setHeader(
              "Access-Control-Expose-Headers",
              Array.from(headersSet).join(", ")
            );
          })
        }
      ]
    }
  };
};

export { bearer };
