'use strict';

require('../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
const cookies_index = require('../shared/better-auth.anw-08Z3.cjs');
require('better-call');
require('zod');
const session = require('../shared/better-auth.B0k5C6Ik.cjs');
require('../shared/better-auth.l_Ru3SGW.cjs');
require('@better-auth/core/db');
require('../shared/better-auth.Bu93hUoT.cjs');
require('@better-auth/utils/random');
require('@better-auth/utils/hash');
require('@noble/ciphers/chacha.js');
require('@noble/ciphers/utils.js');
require('jose');
require('@noble/hashes/scrypt.js');
require('@better-auth/utils/hex');
require('@noble/hashes/utils.js');
require('../shared/better-auth.CYeOI8C-.cjs');
require('kysely');
require('../shared/better-auth.sRvUzL4j.cjs');
require('../plugins/organization/access/index.cjs');
require('@better-auth/utils/otp');
require('../plugins/admin/access/index.cjs');
require('@better-fetch/fetch');
require('@better-auth/utils');
require('../plugins/custom-session/index.cjs');
require('@noble/hashes/sha3.js');
require('../plugins/device-authorization/index.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('../shared/better-auth.C1hdVENX.cjs');
require('../shared/better-auth.Jlhc86WK.cjs');
require('../shared/better-auth.DxBcELEX.cjs');
require('../shared/better-auth.uykCWCYS.cjs');
require('../crypto/index.cjs');
require('jose/errors');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('defu');
require('../plugins/access/index.cjs');
require('../shared/better-auth.DNqtHmvg.cjs');
require('../shared/better-auth.BMgeJg3r.cjs');

const reactStartCookies = () => {
  return {
    id: "react-start-cookies",
    hooks: {
      after: [
        {
          matcher(ctx) {
            return true;
          },
          handler: session.createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookies = returned?.get("set-cookie");
              if (!setCookies) return;
              const parsed = cookies_index.parseSetCookieHeader(setCookies);
              const { setCookie } = await import('../chunks/index.cjs');
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
                  setCookie(key, decodeURIComponent(value.value), opts);
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

exports.reactStartCookies = reactStartCookies;
