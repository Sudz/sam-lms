'use strict';

require('better-call');
require('../shared/better-auth.l_Ru3SGW.cjs');
const session = require('../shared/better-auth.B0k5C6Ik.cjs');
require('zod');
require('../shared/better-auth.B6fIklBU.cjs');
require('@better-auth/utils/base64');
require('@better-auth/utils/hmac');
require('../shared/better-auth.BToNb2fI.cjs');
require('@better-auth/utils/binary');
const cookies_index = require('../shared/better-auth.anw-08Z3.cjs');
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
require('../shared/better-auth.C1hdVENX.cjs');
require('../crypto/index.cjs');
require('../shared/better-auth.ANpbi45u.cjs');
require('@better-fetch/fetch');
require('../shared/better-auth.DxBcELEX.cjs');
require('jose/errors');
require('../shared/better-auth.Jlhc86WK.cjs');
require('../shared/better-auth.Bg6iw3ig.cjs');
require('defu');
require('../shared/better-auth.uykCWCYS.cjs');

const toSvelteKitHandler = (auth) => {
  return (event) => auth.handler(event.request);
};
const svelteKitHandler = async ({
  auth,
  event,
  resolve,
  building
}) => {
  if (building) {
    return resolve(event);
  }
  const { request, url } = event;
  if (isAuthPath(url.toString(), auth.options)) {
    return auth.handler(request);
  }
  return resolve(event);
};
function isAuthPath(url, options) {
  const _url = new URL(url);
  const baseURL = new URL(
    `${options.baseURL || _url.origin}${options.basePath || "/api/auth"}`
  );
  if (_url.origin !== baseURL.origin) return false;
  if (!_url.pathname.startsWith(
    baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`
  ))
    return false;
  return true;
}
const sveltekitCookies = (getRequestEvent) => {
  return {
    id: "sveltekit-cookies",
    hooks: {
      after: [
        {
          matcher() {
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
              const event = getRequestEvent();
              if (!event) return;
              const parsed = cookies_index.parseSetCookieHeader(setCookies);
              for (const [name, { value, ...ops }] of parsed) {
                try {
                  event.cookies.set(name, decodeURIComponent(value), {
                    sameSite: ops.samesite,
                    path: ops.path || "/",
                    expires: ops.expires,
                    secure: ops.secure,
                    httpOnly: ops.httponly,
                    domain: ops.domain,
                    maxAge: ops["max-age"]
                  });
                } catch (e) {
                }
              }
            }
          })
        }
      ]
    }
  };
};

exports.isAuthPath = isAuthPath;
exports.svelteKitHandler = svelteKitHandler;
exports.sveltekitCookies = sveltekitCookies;
exports.toSvelteKitHandler = toSvelteKitHandler;
