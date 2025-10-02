'use strict';

const betterCall = require('better-call');
require('../../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
const hmac = require('@better-auth/utils/hmac');
require('../../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
const cookies_index = require('../../shared/better-auth.anw-08Z3.cjs');
require('../../shared/better-auth.l_Ru3SGW.cjs');
const session = require('../../shared/better-auth.B0k5C6Ik.cjs');
require('zod');
require('@better-auth/core/db');
require('../../shared/better-auth.Bu93hUoT.cjs');
require('@better-auth/utils/random');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
require('../../shared/better-auth.ANpbi45u.cjs');
require('../../shared/better-auth.C1hdVENX.cjs');
require('../../shared/better-auth.Jlhc86WK.cjs');
require('../../shared/better-auth.DxBcELEX.cjs');
require('../../crypto/index.cjs');
require('@better-fetch/fetch');
require('jose/errors');
require('../../shared/better-auth.Bg6iw3ig.cjs');
require('defu');
require('../../shared/better-auth.uykCWCYS.cjs');

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
          handler: session.createAuthMiddleware(async (c) => {
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
              signedToken = (await betterCall.serializeSignedCookie("", token, c.context.secret)).replace("=", "");
            }
            try {
              const decodedToken = decodeURIComponent(signedToken);
              const isValid = await hmac.createHMAC(
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
          handler: session.createAuthMiddleware(async (ctx) => {
            const setCookie = ctx.context.responseHeaders?.get("set-cookie");
            if (!setCookie) {
              return;
            }
            const parsedCookies = cookies_index.parseSetCookieHeader(setCookie);
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

exports.bearer = bearer;
