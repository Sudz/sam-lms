import 'better-call';
import '../shared/better-auth.CpZXDeOc.mjs';
import { c as createAuthMiddleware } from '../shared/better-auth.D_jpufHc.mjs';
import 'zod';
import '../shared/better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import '../shared/better-auth.DgGir396.mjs';
import '@better-auth/utils/binary';
import { p as parseSetCookieHeader } from '../shared/better-auth.L4mY8Wf-.mjs';
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
import '../shared/better-auth.CW6D9eSx.mjs';
import '../crypto/index.mjs';
import '../shared/better-auth.DdzSJf-n.mjs';
import '@better-fetch/fetch';
import '../shared/better-auth.BAQSo96z.mjs';
import 'jose/errors';
import '../shared/better-auth.BTrSrKsi.mjs';
import '../shared/better-auth.BUPPRXfK.mjs';
import 'defu';
import '../shared/better-auth.D2xndZ2p.mjs';

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
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") {
              return;
            }
            if (returned instanceof Headers) {
              const setCookies = returned?.get("set-cookie");
              if (!setCookies) return;
              const event = getRequestEvent();
              if (!event) return;
              const parsed = parseSetCookieHeader(setCookies);
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

export { isAuthPath, svelteKitHandler, sveltekitCookies, toSvelteKitHandler };
