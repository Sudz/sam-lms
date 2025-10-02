import * as z from 'zod';
import 'better-call';
import { o as originCheck } from '../../shared/better-auth.CpZXDeOc.mjs';
import { c as createAuthMiddleware, a as createAuthEndpoint } from '../../shared/better-auth.D_jpufHc.mjs';
import { e as env } from '../../shared/better-auth.CiuwFiHM.mjs';
import '@better-auth/utils/base64';
import '@better-auth/utils/hmac';
import '../../shared/better-auth.DgGir396.mjs';
import { g as getOrigin } from '../../shared/better-auth.BAQSo96z.mjs';
import '@better-auth/utils/binary';
import '@better-auth/core/db';
import '../../shared/better-auth.BZghgUMh.mjs';
import '@better-auth/utils/random';
import { symmetricEncrypt, symmetricDecrypt } from '../../crypto/index.mjs';
import 'kysely';
import '../../shared/better-auth.CW6D9eSx.mjs';
import '@better-auth/utils/hash';
import '@better-fetch/fetch';
import 'jose';
import '@noble/ciphers/chacha.js';
import '@noble/ciphers/utils.js';
import '@noble/hashes/scrypt.js';
import '@better-auth/utils/hex';
import '@noble/hashes/utils.js';
import '../../shared/better-auth.B4Qoxdgc.mjs';
import '../../shared/better-auth.L4mY8Wf-.mjs';
import '../../shared/better-auth.DdzSJf-n.mjs';
import '../../shared/better-auth.BTrSrKsi.mjs';
import 'jose/errors';
import '../../shared/better-auth.BUPPRXfK.mjs';
import 'defu';
import '../../shared/better-auth.D2xndZ2p.mjs';

function getVenderBaseURL() {
  const vercel = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : void 0;
  const netlify = env.NETLIFY_URL;
  const render = env.RENDER_URL;
  const aws = env.AWS_LAMBDA_FUNCTION_NAME;
  const google = env.GOOGLE_CLOUD_FUNCTION_NAME;
  const azure = env.AZURE_FUNCTION_NAME;
  return vercel || netlify || render || aws || google || azure;
}
const oAuthProxy = (opts) => {
  const resolveCurrentURL = (ctx) => {
    return new URL(
      opts?.currentURL || ctx.request?.url || getVenderBaseURL() || ctx.context.baseURL
    );
  };
  const checkSkipProxy = (ctx) => {
    const skipProxy = ctx.request?.headers.get("x-skip-oauth-proxy");
    if (skipProxy) {
      return true;
    }
    const productionURL = opts?.productionURL || env.BETTER_AUTH_URL;
    if (productionURL === ctx.context.options.baseURL) {
      return true;
    }
    return false;
  };
  return {
    id: "oauth-proxy",
    options: opts,
    endpoints: {
      oAuthProxy: createAuthEndpoint(
        "/oauth-proxy-callback",
        {
          method: "GET",
          query: z.object({
            callbackURL: z.string().meta({
              description: "The URL to redirect to after the proxy"
            }),
            cookies: z.string().meta({
              description: "The cookies to set after the proxy"
            })
          }),
          use: [originCheck((ctx) => ctx.query.callbackURL)],
          metadata: {
            openapi: {
              description: "OAuth Proxy Callback",
              parameters: [
                {
                  in: "query",
                  name: "callbackURL",
                  required: true,
                  description: "The URL to redirect to after the proxy"
                },
                {
                  in: "query",
                  name: "cookies",
                  required: true,
                  description: "The cookies to set after the proxy"
                }
              ],
              responses: {
                302: {
                  description: "Redirect",
                  headers: {
                    Location: {
                      description: "The URL to redirect to",
                      schema: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        async (ctx) => {
          const cookies = ctx.query.cookies;
          const decryptedCookies = await symmetricDecrypt({
            key: ctx.context.secret,
            data: cookies
          }).catch((e) => {
            ctx.context.logger.error(e);
            return null;
          });
          const error = ctx.context.options.onAPIError?.errorURL || `${ctx.context.options.baseURL}/api/auth/error`;
          if (!decryptedCookies) {
            throw ctx.redirect(
              `${error}?error=OAuthProxy - Invalid cookies or secret`
            );
          }
          const isSecureContext = resolveCurrentURL(ctx).protocol === "https:";
          const prefix = ctx.context.options.advanced?.cookiePrefix || "better-auth";
          const cookieToSet = isSecureContext ? decryptedCookies : decryptedCookies.replace("Secure;", "").replace(`__Secure-${prefix}`, prefix);
          ctx.setHeader("set-cookie", cookieToSet);
          throw ctx.redirect(ctx.query.callbackURL);
        }
      )
    },
    hooks: {
      after: [
        {
          matcher(context) {
            return context.path?.startsWith("/callback") || context.path?.startsWith("/oauth2/callback");
          },
          handler: createAuthMiddleware(async (ctx) => {
            const headers = ctx.context.responseHeaders;
            const location = headers?.get("location");
            if (location?.includes("/oauth-proxy-callback?callbackURL")) {
              if (!location.startsWith("http")) {
                return;
              }
              const locationURL = new URL(location);
              const origin = locationURL.origin;
              const productionURL = opts?.productionURL || ctx.context.options.baseURL || ctx.context.baseURL;
              if (origin === getOrigin(productionURL)) {
                const newLocation = locationURL.searchParams.get("callbackURL");
                if (!newLocation) {
                  return;
                }
                ctx.setHeader("location", newLocation);
                return;
              }
              const setCookies = headers?.get("set-cookie");
              if (!setCookies) {
                return;
              }
              const encryptedCookies = await symmetricEncrypt({
                key: ctx.context.secret,
                data: setCookies
              });
              const locationWithCookies = `${location}&cookies=${encodeURIComponent(
                encryptedCookies
              )}`;
              ctx.setHeader("location", locationWithCookies);
            }
          })
        }
      ],
      before: [
        {
          matcher() {
            return true;
          },
          handler: createAuthMiddleware(async (ctx) => {
            const skipProxy = checkSkipProxy(ctx);
            if (skipProxy || ctx.path !== "/callback/:id") {
              return;
            }
            return {
              context: {
                context: {
                  oauthConfig: {
                    skipStateCookieCheck: true
                  }
                }
              }
            };
          })
        },
        {
          matcher(context) {
            return context.path?.startsWith("/sign-in/social") || context.path?.startsWith("/sign-in/oauth2");
          },
          handler: createAuthMiddleware(async (ctx) => {
            const skipProxy = checkSkipProxy(ctx);
            console.log("skipProxy", skipProxy);
            if (skipProxy) {
              return;
            }
            const url = resolveCurrentURL(ctx);
            if (!ctx.body) {
              return;
            }
            ctx.body.callbackURL = `${url.origin}${ctx.context.options.basePath || "/api/auth"}/oauth-proxy-callback?callbackURL=${encodeURIComponent(
              ctx.body.callbackURL || ctx.context.baseURL
            )}`;
            return {
              context: ctx
            };
          })
        }
      ]
    }
  };
};

export { oAuthProxy };
